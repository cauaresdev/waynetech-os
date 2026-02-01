import { useState, useEffect } from 'react';
import { 
  Dumbbell, Plus, Edit3, Lock, Play, LogOut, 
  Shield, Trash2, ArrowLeft, Activity
} from 'lucide-react';

// IMPORTAÇÃO DAS ABAS
import MissionsTab from './MissionsTab';
import ChecklistTab from './ChecklistTab';
import JournalTab from './JournalTab';

// ==========================================
// ⚙️ CONFIGURAÇÃO DA API
// ==========================================
// 👇👇👇 CONFIRA SEU LINK AQUI 👇👇👇
const API_BASE = 'https://arkham-backend.onrender.com'; 

// --- TIPOS ---
type AppTab = 'dashboard' | 'routine' | 'protocols' | 'stats' | 'checklist' | 'missions' | 'journal' | 'library';
interface Exercise { id?: number; name: string; sets: string; weight: string; }
interface Workout { id?: number; name: string; exercises: Exercise[]; }
type WorkoutDay = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
type UserGoal = 'hipertrofia' | 'forca' | 'definicao';
type WorkoutPlans = Record<UserGoal, Record<WorkoutDay, Workout>>;
interface RoutineItem { id: number; timeStart: string; timeEnd: string; activity: string; category: 'work' | 'training' | 'rest' | 'sustenance'; }
interface Lesson { id: number; title: string; duration: string; completed: boolean; type: 'video' | 'text'; videoUrl?: string; }
interface Module { id: number; title: string; lessons: Lesson[]; }
interface Course { id: number; title: string; description: string; progress: number; modules: Module[]; }

// --- DADOS MESTRES (Para Auto-Gênese) ---
const masterWorkoutPlans: WorkoutPlans = {
  hipertrofia: {
    segunda: { name: 'COSTAS, BÍCEPS & MANOPLA', exercises: [{ name: 'Levantamento Terra', sets: '4x6-8', weight: 'BW + 20kg' }, { name: 'Barra Fixa com Peso', sets: '4x8-10', weight: 'BW' }, { name: 'Remada Curvada', sets: '4x10', weight: '60kg' }, { name: 'Rosca Direta W', sets: '3x12', weight: '30kg' }, { name: 'Rosca Martelo', sets: '3x12', weight: '16kg' }] },
    terca: { name: 'INFERIOR A (Foco Quadríceps)', exercises: [{ name: 'Agachamento Livre', sets: '4x6-8', weight: '80kg' }, { name: 'Leg Press 45', sets: '4x10-12', weight: '200kg' }, { name: 'Extensora', sets: '3x15', weight: 'Placas Max' }, { name: 'Panturrilha em Pé', sets: '5x15', weight: 'BW' }] },
    quarta: { name: 'OMBROS & TRAPÉZIO', exercises: [{ name: 'Desenvolvimento Militar', sets: '4x8', weight: '40kg' }, { name: 'Elevação Lateral', sets: '4x12', weight: '12kg' }, { name: 'Elevação Frontal', sets: '3x12', weight: '12kg' }, { name: 'Encolhimento', sets: '4x15', weight: '30kg' }] },
    quinta: { name: 'INFERIOR B (Foco Posterior)', exercises: [{ name: 'Stiff', sets: '4x8-10', weight: '70kg' }, { name: 'Mesa Flexora', sets: '4x12', weight: 'Placas Med' }, { name: 'Cadeira Flexora', sets: '3x15', weight: 'Placas Med' }, { name: 'Passada (Avanço)', sets: '3x20', weight: 'Halteres 10kg' }] },
    sexta: { name: 'PEITO & TRÍCEPS', exercises: [{ name: 'Supino Reto', sets: '4x6-8', weight: '70kg' }, { name: 'Supino Inclinado Halteres', sets: '4x10', weight: '24kg' }, { name: 'Crossover (Polia)', sets: '3x15', weight: 'Placas' }, { name: 'Tríceps Testa', sets: '4x10', weight: '30kg' }, { name: 'Tríceps Corda', sets: '3x15', weight: 'Placas' }] },
    sabado: { name: 'ARKHAM: Condicionamento', exercises: [{ name: 'Corrida Intervalada', sets: '20 min', weight: 'Alta Int.' }, { name: 'Saco de Pancada', sets: '5 rounds', weight: '3 min' }, { name: 'Pular Corda', sets: '10 min', weight: 'Constante' }] },
    domingo: { name: 'Descanso Tático', exercises: [{ name: 'Alongamento Completo', sets: '1x', weight: '20 min' }, { name: 'Mobilidade Articular', sets: '1x', weight: '15 min' }] }
  },
  forca: { 
    segunda: { name: 'Upper Strength', exercises: [{ name: 'Supino', sets: '5x5', weight: '80kg' }] }, terca: { name: 'Lower Strength', exercises: [{ name: 'Agachamento', sets: '5x5', weight: '100kg' }] }, quarta: { name: 'Rest', exercises: [] }, quinta: { name: 'Upper Hyper', exercises: [{ name: 'Militar', sets: '3x10', weight: '40kg' }] }, sexta: { name: 'Lower Hyper', exercises: [{ name: 'Leg Press', sets: '3x12', weight: '200kg' }] }, sabado: { name: 'Rest', exercises: [] }, domingo: { name: 'Rest', exercises: [] } 
  },
  definicao: { 
    segunda: { name: 'Fullbody A', exercises: [{ name: 'Burpees', sets: '3x15', weight: 'BW' }] }, terca: { name: 'Cardio', exercises: [{ name: 'Esteira', sets: '45min', weight: 'Leve' }] }, quarta: { name: 'Fullbody B', exercises: [{ name: 'Flexões', sets: '4x20', weight: 'BW' }] }, quinta: { name: 'Cardio', exercises: [{ name: 'Bike', sets: '45min', weight: 'Mod' }] }, sexta: { name: 'Fullbody C', exercises: [{ name: 'Agachamento Salto', sets: '3x15', weight: 'BW' }] }, sabado: { name: 'HIIT', exercises: [{ name: 'Sprints', sets: '10x', weight: 'Max' }] }, domingo: { name: 'Rest', exercises: [] } 
  }
};

const defaultRoutine: RoutineItem[] = [{ id: 1, timeStart: '07:00', timeEnd: '07:15', activity: 'Stomach Vacuum', category: 'training' }];
const defaultCourses: Course[] = [ { id: 1, title: "COMBATE MENTAL", description: "Técnicas de foco.", progress: 15, modules: [{ id: 1, title: "FASE 1: BLINDAGEM", lessons: [{ id: 101, title: "O Princípio da Contingência", duration: "12:00", completed: true, type: "video", videoUrl: "https://www.youtube.com/watch?v=m-N5aAiaM2Y&list=PLEfwqyY2ox86Ph-WfPNEob_yIhSRDoIQ1" }] }] } ];

// --- COMPONENTES AUXILIARES ---
const TechCard = ({ children, className = "", title, icon: Icon, active = false }: any) => (
  <div className={`relative overflow-hidden rounded-sm border transition-all duration-300 ${active ? 'border-accent-blue bg-accent-blue/5' : `border-wayne-border bg-wayne-panel hover:border-accent-blue/30`} backdrop-blur-sm ${className}`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10"></div>
    <div className="relative z-10 p-6 h-full flex flex-col">
      {title && ( <div className="flex items-start justify-between mb-6 pb-4 border-b border-wayne-border"> <div> <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3 font-hud"> {Icon && <Icon size={18} className="text-accent-blue" />} {title} </h3> </div> </div> )}
      {children}
    </div>
  </div>
);

const TacticalButton = ({ children, onClick, variant = 'primary', className = "" }: any) => (
    <button onClick={onClick} className={`px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-2 font-hud ${variant === 'primary' ? 'bg-accent-blue hover:bg-accent-blue-dim text-black shadow-lg' : 'bg-transparent border border-wayne-border text-text-muted hover:text-white hover:border-accent-blue'} ${className}`}>
        {children}
    </button>
);

const MilitaryVideoPlayer = ({ lesson, onComplete }: { lesson: Lesson, onComplete: () => void }) => {
    const getEmbedUrl = (url: string) => { if (!url) return null; const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/); return (m && m[2].length === 11) ? `https://www.youtube.com/embed/${m[2]}` : null; };
    const embedUrl = getEmbedUrl(lesson.videoUrl || '');
    return (
        <div className="w-full font-hud mb-6 animate-in fade-in duration-500">
            <div className="relative group bg-black border border-wayne-border shadow-lg overflow-hidden aspect-video flex flex-col rounded-sm">
                {embedUrl ? ( <iframe src={embedUrl} title={lesson.title} className="w-full h-full flex-1 border-0" allowFullScreen></iframe> ) : ( <div className="flex-1 bg-wayne-dark/50 flex items-center justify-center relative"><div className="text-center z-10 p-6"><Play size={48} className="text-accent-blue mx-auto mb-4 opacity-50" /><p className="text-[10px] text-accent-red mt-2">SINAL DE VÍDEO PERDIDO</p></div></div> )}
                <div className="bg-wayne-panel border-t border-wayne-border p-3 z-30 flex justify-between items-center"> <div className="text-[10px] font-mono text-accent-blue">{embedUrl ? "FEED: ONLINE [SECURE]" : "FEED: OFFLINE"}</div> <TacticalButton onClick={onComplete} className="py-1 px-3 text-[10px]">Concluir</TacticalButton> </div>
            </div>
        </div>
    );
};

export default function BatmanWorkoutDashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('bat_token'));
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // ESTADO INICIAL NULL (Para evitar piscar dados errados)
  const [loading, setLoading] = useState(false);
  const [workoutData, setWorkoutData] = useState<WorkoutPlans | null>(null);
  
  const [userProfile, setUserProfile] = useState(() => { const s = localStorage.getItem('bat_profile_v2'); return s ? JSON.parse(s) : { name: '', weight: '', goal: 'hipertrofia' }; });
  const [routine] = useState<RoutineItem[]>(() => { const s = localStorage.getItem('bat_routine'); return s ? JSON.parse(s) : defaultRoutine; });
  const [courses] = useState<Course[]>(() => { const s = localStorage.getItem('bat_courses'); return s ? JSON.parse(s) : defaultCourses; });

  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay>('segunda');
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const currentGoal: UserGoal = (userProfile.goal as UserGoal) || 'hipertrofia';
  const imc = (parseFloat(userProfile.weight) && parseFloat(userProfile.height)) ? (parseFloat(userProfile.weight) / ((parseFloat(userProfile.height)/100)**2)).toFixed(1) : 'N/A';

  // --- O CÉREBRO AUTÔNOMO ---
  useEffect(() => {
    if (!token) return;

    const initializeSystem = async () => {
        setLoading(true);
        try {
            // 1. Tenta buscar os dados do banco
            const res = await fetch(`${API_BASE}/workouts`, { headers: { 'Authorization': `Bearer ${token}` } });
            
            if (res.ok) {
                const dataList = await res.json();
                
                // 2. Lógica de Decisão: Banco Vazio ou Incompleto?
                if (!Array.isArray(dataList) || dataList.length < 5) {
                    console.log("🦇 Banco incompleto detectado. Iniciando Auto-Gênese...");
                    await performAutoGenesis();
                } else {
                    // 3. Banco Saudável: Processar e Exibir
                    processAndSetData(dataList);
                }
            } else {
                console.warn("Erro ao ler banco. Tentando Auto-Gênese...");
                await performAutoGenesis();
            }
        } catch (error) {
            console.error("Erro fatal de conexão:", error);
        } finally {
            setLoading(false);
        }
    };

    const performAutoGenesis = async () => {
        // Prepara os dados mestres para envio
        const payload: any[] = [];
        Object.keys(masterWorkoutPlans).forEach((goal: string) => {
             const days = masterWorkoutPlans[goal as UserGoal];
             Object.keys(days).forEach((day: string) => {
                 const workout = days[day as WorkoutDay];
                 payload.push({ category: goal, day: day, name: workout.name, exercises: workout.exercises });
             });
        });

        // Envia para o servidor limpar e criar
        try {
            await fetch(`${API_BASE}/workouts/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ plans: payload })
            });
            // Recarrega os dados frescos
            const res = await fetch(`${API_BASE}/workouts`, { headers: { 'Authorization': `Bearer ${token}` } });
            const newData = await res.json();
            processAndSetData(newData);
        } catch (e) { console.error("Falha na Auto-Gênese", e); }
    };

    const processAndSetData = (dataList: any[]) => {
        const newPlans = JSON.parse(JSON.stringify(masterWorkoutPlans));
        let matchCount = 0;
        dataList.forEach((w: any) => {
            const catKey = w.category.toLowerCase().trim() as UserGoal;
            const dayKey = w.day.toLowerCase().trim() as WorkoutDay;
            if (newPlans[catKey] && newPlans[catKey][dayKey]) {
                newPlans[catKey][dayKey] = {
                    id: w.id, // ID REAL DO BANCO
                    name: w.name,
                    exercises: w.exercises // EXERCÍCIOS REAIS COM ID
                };
                matchCount++;
            }
        });
        console.log(`🦇 Sistema Sincronizado: ${matchCount} módulos carregados.`);
        setWorkoutData(newPlans);
    };

    initializeSystem();
  }, [token]);


  // --- HANDLERS ---
  const handleAuth = async () => {
      const endpoint = isRegistering ? '/register' : '/login';
      try {
          const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm) });
          const data = await res.json();
          if (res.ok) {
              if (isRegistering) { setIsRegistering(false); setAuthError('Registro OK. Faça login.'); }
              else { localStorage.setItem('bat_token', data.token); setToken(data.token); setUserProfile((p: any) => ({ ...p, name: data.user.name })); }
          } else { setAuthError(data.error || 'Falha.'); }
      } catch { setAuthError('Erro de conexão.'); }
  };

  const saveExercise = async (exercise: Exercise) => {
      if (!exercise.id || !token) return;
      try {
          await fetch(`${API_BASE}/exercises/${exercise.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(exercise)
          });
      } catch (e) { console.error("Erro ao salvar", e); }
  };

  const handleExerciseChange = (idx: number, field: keyof Exercise, val: string) => { 
      if(!workoutData) return;
      const u = JSON.parse(JSON.stringify(workoutData)); 
      u[currentGoal][selectedDay].exercises[idx][field] = val; 
      setWorkoutData(u); 
  };
  const handleExerciseBlur = (idx: number) => { 
      if(!workoutData) return;
      saveExercise(workoutData[currentGoal][selectedDay].exercises[idx]); 
  };
  const addNewExercise = () => { if(!workoutData) return; const u = JSON.parse(JSON.stringify(workoutData)); u[currentGoal][selectedDay].exercises.push({ name: 'Novo', sets: '3x10', weight: '0kg' }); setWorkoutData(u); };
  const removeExercise = (idx: number) => { if(!workoutData) return; const u = JSON.parse(JSON.stringify(workoutData)); u[currentGoal][selectedDay].exercises.splice(idx, 1); setWorkoutData(u); };


  // --- RENDERIZAÇÃO ---
  if (!token) return (
      <div className="min-h-screen bg-wayne-dark flex items-center justify-center p-6 font-hud">
          <TechCard className="w-full max-w-md" title={isRegistering ? "Novo Operador" : "Acesso Restrito"} icon={Lock}>
              <div className="space-y-4">
                  {isRegistering && (<div><label className="text-xs font-bold text-text-muted mb-2 block">CODINOME</label><input className="w-full bg-wayne-dark border border-wayne-border p-3 text-white" value={authForm.name} onChange={e=>setAuthForm({...authForm, name: e.target.value})}/></div>)}
                  <div><label className="text-xs font-bold text-text-muted mb-2 block">IDENTIFICAÇÃO</label><input type="email" className="w-full bg-wayne-dark border border-wayne-border p-3 text-white" value={authForm.email} onChange={e=>setAuthForm({...authForm, email: e.target.value})}/></div>
                  <div><label className="text-xs font-bold text-text-muted mb-2 block">SENHA</label><input type="password" className="w-full bg-wayne-dark border border-wayne-border p-3 text-white" value={authForm.password} onChange={e=>setAuthForm({...authForm, password: e.target.value})}/></div>
                  {authError && <div className="text-accent-red text-xs">{authError}</div>}
                  <TacticalButton onClick={handleAuth} className="w-full">{isRegistering ? 'REGISTRAR' : 'ACESSAR'}</TacticalButton>
                  <div className="text-center pt-4 border-t border-wayne-border"><button onClick={()=>{setIsRegistering(!isRegistering);setAuthError('')}} className="text-xs text-text-muted hover:text-white">{isRegistering ? 'JÁ TEM CONTA? ENTRAR' : 'SOLICITAR ACESSO'}</button></div>
              </div>
          </TechCard>
      </div>
  );

  // TELA DE CARREGAMENTO (Evita o Flicker)
  if (loading || !workoutData) return (
      <div className="min-h-screen bg-wayne-dark flex items-center justify-center font-hud">
          <div className="text-center animate-pulse">
              <Activity className="text-accent-blue mx-auto mb-4 w-12 h-12"/>
              <h2 className="text-xl text-white font-bold tracking-[0.3em]">CONECTANDO AO SERVIDOR...</h2>
              <p className="text-xs text-text-muted mt-2">SINCRONIZANDO DADOS TÁTICOS</p>
          </div>
      </div>
  );

  const safePlan = workoutData[currentGoal] || masterWorkoutPlans[currentGoal];
  const currentWorkout = safePlan[selectedDay];

  return (
    <div className="min-h-screen bg-wayne-dark text-text-main pb-24 font-hud selection:bg-accent-blue selection:text-black relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-wayne-border pb-6">
          <div>
            <div className={`inline-flex items-center gap-2 px-2 py-1 border text-[10px] uppercase font-bold mb-3 rounded-sm bg-accent-blue/10 border-accent-blue/30 text-accent-blue`}> <Shield size={10} /> ACESSO AUTORIZADO </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase"> BEM-VINDO, <span className="text-accent-blue">{userProfile.name}</span> </h1>
          </div>
          <div className="flex gap-4">
              <div className="bg-wayne-panel px-6 py-2 rounded-sm border border-wayne-border text-center"> <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">IMC</div> <div className="text-xl font-bold text-white font-mono">{imc}</div> </div>
              <button onClick={()=>{localStorage.removeItem('bat_token');setToken(null)}} className="bg-wayne-panel border border-wayne-border text-text-muted hover:text-accent-red px-4 rounded-sm" title="Sair"> <LogOut size={20} /> </button>
          </div>
        </header>

        <nav className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-wayne-border scrollbar-hide">
          {['dashboard', 'routine', 'protocols', 'stats', 'checklist', 'missions', 'library', 'journal'].map((tab: any) => (
            <button key={tab} onClick={() => setCurrentTab(tab)} className={`px-6 py-3 text-xs font-bold uppercase transition-all border-b-2 tracking-widest whitespace-nowrap ${currentTab === tab ? 'border-accent-blue text-accent-blue bg-accent-blue/5' : 'border-transparent text-text-muted hover:text-white'}`}> {tab === 'protocols' ? 'PROTOCOLOS' : tab === 'routine' ? 'AGENDA' : tab} </button>
          ))}
        </nav>

        {currentTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-2">
                <TechCard title="Protocolo de Treino" icon={Dumbbell} subtitle="Sequência de Combate">
                    <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                        {Object.keys(safePlan).map((day: any) => (
                            <button key={day} onClick={() => setSelectedDay(day)} className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase border transition-all tracking-wider ${selectedDay === day ? 'bg-accent-blue text-black border-accent-blue' : 'bg-wayne-dark text-text-muted border-wayne-border hover:border-accent-blue/50'}`}>{day.substring(0,3)}</button>
                        ))}
                    </div>
                    
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white uppercase">{currentWorkout?.name}</h2>
                        <button onClick={() => setIsEditingWorkout(!isEditingWorkout)} className="text-text-muted hover:text-accent-blue bg-wayne-panel p-2 rounded-sm border border-wayne-border"> <Edit3 size={18}/> </button>
                    </div>

                    <div className="space-y-3">
                        {currentWorkout?.exercises.map((ex: any, idx: number) => (
                            <div key={idx} className="bg-wayne-dark p-4 rounded-sm border border-wayne-border flex justify-between items-center group hover:border-accent-blue/30 transition-colors">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="text-xs font-bold text-accent-blue font-mono">0{idx+1}</div>
                                    <div className="flex-1">
                                        {isEditingWorkout ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                <input className="bg-wayne-panel p-2 rounded-sm text-white text-sm border border-wayne-border" value={ex.name} onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)} onBlur={() => handleExerciseBlur(idx)} />
                                                <input className="bg-wayne-panel p-2 rounded-sm text-text-muted text-xs border border-wayne-border" value={ex.sets} onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)} onBlur={() => handleExerciseBlur(idx)} />
                                                <input className="bg-wayne-panel p-2 rounded-sm text-accent-blue text-xs border border-wayne-border" value={ex.weight} onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)} onBlur={() => handleExerciseBlur(idx)} />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-sm font-bold text-white uppercase tracking-wide">{ex.name}</div>
                                                <div className="text-xs text-text-muted mt-1 font-mono">{ex.sets} • <span className="text-accent-blue">{ex.weight}</span></div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {isEditingWorkout ? <button onClick={() => removeExercise(idx)} className="text-accent-red hover:text-white"><Trash2 size={16}/></button> : <div className="w-2 h-2 bg-wayne-border group-hover:bg-accent-blue rounded-full transition-colors"></div>}
                            </div>
                        ))}
                    </div>
                    {isEditingWorkout && <button onClick={addNewExercise} className="w-full py-3 mt-4 border border-dashed border-wayne-border rounded-sm text-text-muted hover:text-accent-blue flex justify-center items-center gap-2 text-xs font-bold uppercase"><Plus size={14}/> Adicionar Módulo</button>}
                </TechCard>
             </div>
             
             <div className="space-y-8"> <ChecklistTab token={token} /> </div>
          </div>
        )}

        {currentTab === 'routine' && <div className="animate-in fade-in"><TechCard title="Agenda"><div className="space-y-4">{routine.map(i => <div key={i.id} className="p-4 bg-wayne-panel border border-wayne-border"><span className="text-accent-blue font-bold text-xs">{i.timeStart}</span><h3 className="text-white font-bold">{i.activity}</h3></div>)}</div></TechCard></div>}
        {currentTab === 'protocols' && ( <div className="animate-in fade-in"> {activeCourseId === null ? ( <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{courses.map(c => <TechCard key={c.id} title={c.title} icon={Lock} className="cursor-pointer" ><div onClick={() => { setActiveCourseId(c.id); setActiveLesson(c.modules[0].lessons[0]); }}><p className="text-sm text-text-muted mb-4">{c.description}</p><TacticalButton className="text-[10px] w-full">Acessar</TacticalButton></div></TechCard>)}</div> ) : ( <div> <button onClick={() => setActiveCourseId(null)} className="mb-4 text-xs font-bold text-text-muted flex items-center gap-2"><ArrowLeft size={14}/> Voltar</button> <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> <div className="lg:col-span-2">{activeLesson && <MilitaryVideoPlayer lesson={activeLesson} onComplete={() => {}} />}</div> <div className="lg:col-span-1"><TechCard title="Aulas"><div className="space-y-2">{courses.find(c=>c.id===activeCourseId)?.modules[0].lessons.map(l => <div key={l.id} onClick={()=>setActiveLesson(l)} className={`p-3 border cursor-pointer ${activeLesson?.id === l.id ? 'border-accent-blue' : 'border-wayne-border'}`}>{l.title}</div>)}</div></TechCard></div> </div> </div> )} </div> )}
        {currentTab === 'missions' && <div className="animate-in fade-in"><MissionsTab token={token} /></div>}
        {currentTab === 'checklist' && <div className="animate-in fade-in"><ChecklistTab token={token} /></div>}
        {currentTab === 'journal' && <div className="animate-in fade-in"><JournalTab token={token} /></div>}
        {(currentTab === 'library' || currentTab === 'stats') && ( <div className="flex items-center justify-center h-64 animate-in fade-in text-text-muted"> <div className="text-center"> <Lock size={48} className="mx-auto mb-4 opacity-50" /> <p className="font-hud tracking-widest text-xs">MÓDULO EM DESENVOLVIMENTO</p> </div> </div> )}
      </div>
    </div>
  );
}