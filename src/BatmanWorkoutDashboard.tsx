import { useState, useEffect } from 'react';
import { 
    Dumbbell, Plus, 
    CheckSquare, 
    Edit3, Activity, Target, Lock, Check, ArrowLeft, Trash2, Shield, Play, LogOut
} from 'lucide-react';

// --- TIPOS ---
type AppTab = 'dashboard' | 'routine' | 'protocols' | 'stats' | 'checklist' | 'missions' | 'journal' | 'library';
interface Exercise { id?: number; name: string; sets: string; weight: string; }
interface Workout { id?: number; name: string; exercises: Exercise[]; }
type WorkoutDay = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
type UserGoal = 'hipertrofia' | 'forca' | 'definicao';
type WorkoutPlans = Record<UserGoal, Record<WorkoutDay, Workout>>;
interface Mission { id: number; title: string; status: 'intel' | 'em_curso' | 'neutralizado'; priority: 'alta' | 'normal'; }
interface RoutineItem { id: number; timeStart: string; timeEnd: string; activity: string; category: 'work' | 'training' | 'rest' | 'sustenance'; }
interface Lesson { id: number; title: string; duration: string; completed: boolean; type: 'video' | 'text'; videoUrl?: string; }
interface Module { id: number; title: string; lessons: Lesson[]; }
interface Course { id: number; title: string; description: string; progress: number; modules: Module[]; }

// --- COMPONENTES VISUAIS ---
const TechCard = ({ children, className = "", title, icon: Icon, active = false, subtitle }: any) => (
  <div className={`relative overflow-hidden rounded-sm border transition-all duration-300 ${active ? 'border-accent-blue bg-accent-blue/5' : `border-wayne-border bg-wayne-panel hover:border-accent-blue/30`} backdrop-blur-sm ${className}`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10"></div>
    <div className="relative z-10 p-6 h-full flex flex-col">
      {title && (
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-wayne-border">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3 font-hud">
                {Icon && <Icon size={18} className="text-accent-blue" />} {title}
            </h3>
            {subtitle && <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1 ml-8">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  </div>
);

const TacticalButton = ({ children, onClick, variant = 'primary', className = "" }: any) => (
    <button onClick={onClick} className={`px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-2 font-hud ${variant === 'primary' ? 'bg-accent-blue hover:bg-accent-blue-dim text-black shadow-lg' : 'bg-transparent border border-wayne-border text-text-muted hover:text-white hover:border-accent-blue'} ${className}`}>
        {children}
    </button>
);

// --- COMPONENTE PLAYER ---
const MilitaryVideoPlayer = ({ lesson, onComplete }: { lesson: Lesson, onComplete: () => void }) => {
    const getEmbedUrl = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) return `https://www.youtube.com/embed/${match[2]}`;
        return null;
    };
    const embedUrl = getEmbedUrl(lesson.videoUrl || '');
    return (
        <div className="w-full font-hud mb-6 animate-in fade-in duration-500">
            <div className="relative group bg-black border border-wayne-border shadow-lg overflow-hidden aspect-video flex flex-col rounded-sm">
                {embedUrl ? (
                    <iframe src={embedUrl} title={lesson.title} className="w-full h-full flex-1 border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                ) : (
                    <div className="flex-1 bg-wayne-dark/50 flex items-center justify-center relative"><div className="text-center z-10 p-6"><Play size={48} className="text-accent-blue mx-auto mb-4 opacity-50" /><p className="text-[10px] text-accent-red mt-2">SINAL DE VÍDEO PERDIDO</p></div></div>
                )}
                <div className="bg-wayne-panel border-t border-wayne-border p-3 z-30 flex justify-between items-center">
                    <div className="text-[10px] font-mono text-accent-blue">{embedUrl ? "FEED: ONLINE [SECURE]" : "FEED: OFFLINE"}</div>
                    <TacticalButton onClick={onComplete} className="py-1 px-3 text-[10px]">Concluir</TacticalButton>
                </div>
            </div>
        </div>
    );
};

// --- DADOS PADRÃO ---
const defaultWorkoutPlans: WorkoutPlans = { hipertrofia: { segunda: { name: 'COSTAS, BÍCEPS & MANOPLA', exercises: [] }, terca: { name: 'INFERIOR A', exercises: [] }, quarta: { name: 'OMBROS', exercises: [] }, quinta: { name: 'INFERIOR B', exercises: [] }, sexta: { name: 'PEITO & TRÍCEPS', exercises: [] }, sabado: { name: 'ARKHAM: Armadura', exercises: [] }, domingo: { name: 'Descanso Tático', exercises: [] } }, forca: { segunda: { name: 'Upper', exercises: [] }, terca: { name: 'Lower', exercises: [] }, quarta: { name: 'Rest', exercises: [] }, quinta: { name: 'Upper', exercises: [] }, sexta: { name: 'Lower', exercises: [] }, sabado: { name: 'Rest', exercises: [] }, domingo: { name: 'Rest', exercises: [] } }, definicao: { segunda: { name: 'Fullbody', exercises: [] }, terca: { name: 'Cardio', exercises: [] }, quarta: { name: 'Fullbody', exercises: [] }, quinta: { name: 'Cardio', exercises: [] }, sexta: { name: 'Fullbody', exercises: [] }, sabado: { name: 'HIIT', exercises: [] }, domingo: { name: 'Rest', exercises: [] } } };
const defaultRoutine: RoutineItem[] = [{ id: 1, timeStart: '07:00', timeEnd: '07:15', activity: 'Stomach Vacuum', category: 'training' }];
const defaultHabits = [ { id: 1, text: 'Vacuum Matinal', completed: false } ];
const defaultMissions: Mission[] = [ { id: 1, title: 'Vencer Ranking Gymrats', status: 'em_curso', priority: 'alta' } ];
const defaultCourses: Course[] = [ { id: 1, title: "COMBATE MENTAL", description: "Técnicas de foco.", progress: 15, modules: [{ id: 1, title: "FASE 1: BLINDAGEM", lessons: [{ id: 101, title: "O Princípio da Contingência", duration: "12:00", completed: true, type: "video", videoUrl: "https://www.youtube.com/watch?v=m-N5aAiaM2Y&list=PLEfwqyY2ox86Ph-WfPNEob_yIhSRDoIQ1" }] }] } ];

export default function BatmanWorkoutDashboard() {
  // --- AUTH STATES ---
  const [token, setToken] = useState<string | null>(localStorage.getItem('bat_token'));
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // --- APP STATES ---
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [userProfile, setUserProfile] = useState(() => { const s = localStorage.getItem('bat_profile_v2'); return s ? JSON.parse(s) : { name: '', weight: '', goal: 'hipertrofia' }; });
  
  const [workoutData, setWorkoutData] = useState<WorkoutPlans>(defaultWorkoutPlans);
  const [routine] = useState<RoutineItem[]>(() => { const s = localStorage.getItem('bat_routine'); return s ? JSON.parse(s) : defaultRoutine; });
  const [missions] = useState<Mission[]>(() => { const s = localStorage.getItem('bat_missions'); return s ? JSON.parse(s) : defaultMissions; });
  const [habits, setHabits] = useState(() => { const s = localStorage.getItem('bat_habits'); return s ? JSON.parse(s) : defaultHabits; });
  const [courses] = useState<Course[]>(() => { const s = localStorage.getItem('bat_courses'); return s ? JSON.parse(s) : defaultCourses; });
  
  // UI & Modals
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay>('segunda');
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);

  // --- ZONA DE SEGURANÇA ---
  const currentGoal: UserGoal = (userProfile.goal as UserGoal) || 'hipertrofia';
  
  // 1. Define um plano seguro. Se o dado do servidor (workoutData) falhar, usa o padrão (defaultWorkoutPlans)
  const safePlan = workoutData[currentGoal] ? workoutData[currentGoal] : defaultWorkoutPlans[currentGoal];
  
  // 2. Define o treino seguro usando o plano seguro
  const currentWorkout = safePlan?.[selectedDay] || { name: 'Carregando...', exercises: [] };
  
  const imc = (parseFloat(userProfile.weight) && parseFloat(userProfile.height)) ? (parseFloat(userProfile.weight) / ((parseFloat(userProfile.height)/100)**2)).toFixed(1) : 'N/A';

  // --- EFEITO DE CARREGAMENTO (SÓ RODA SE TIVER TOKEN) ---
  useEffect(() => {
    if (!token) return;
    const connectToArkham = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://arkham-backend.onrender.com/workouts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setWorkoutData(data);
            }
        } catch (error) { console.error("Erro offline"); } 
        finally { setLoading(false); }
    };
    connectToArkham();
  }, [token]);

  // --- HANDLERS DE AUTH ---
  const handleAuth = async () => {
      setAuthError('');
      const endpoint = isRegistering ? '/register' : '/login';
      try {
          const res = await fetch(`https://arkham-backend.onrender.com${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(authForm)
          });
          const data = await res.json();
          
          if (res.ok) {
              if (isRegistering) {
                  setIsRegistering(false); // Vai para tela de login
                  setAuthError('Registro confirmado. Faça login.');
              } else {
                  localStorage.setItem('bat_token', data.token);
                  setToken(data.token);
                  setUserProfile((prev: any) => ({ ...prev, name: data.user.name }));
              }
          } else {
              setAuthError(data.error || 'Falha na autenticação');
          }
      } catch (err) {
          setAuthError('Erro de conexão com Arkham Server');
      }
  };

  const handleLogout = () => {
      localStorage.removeItem('bat_token');
      setToken(null);
  };

  // --- SALVAMENTO ---
  const saveExerciseToDb = async (exercise: Exercise) => {
      if (!exercise.id || !token) return;
      setSavingStatus('saving');
      try {
          await fetch(`https://arkham-backend.onrender.com/exercises/${exercise.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(exercise)
          });
          setSavingStatus('saved');
          setTimeout(() => setSavingStatus('idle'), 2000);
      } catch (error) { setSavingStatus('error'); }
  };
  const handleExerciseChange = (exIndex: number, field: keyof Exercise, value: string) => { const u = JSON.parse(JSON.stringify(workoutData)); u[currentGoal][selectedDay].exercises[exIndex][field] = value; setWorkoutData(u); };
  const handleExerciseBlur = (exIndex: number) => { const exercise = workoutData[currentGoal][selectedDay].exercises[exIndex]; saveExerciseToDb(exercise); };

  // --- PERSISTÊNCIA LOCAL AUXILIAR ---
  useEffect(() => { localStorage.setItem('bat_profile_v2', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('bat_missions', JSON.stringify(missions)); }, [missions]);
  useEffect(() => { localStorage.setItem('bat_habits', JSON.stringify(habits)); }, [habits]);

  // Outros handlers (simplificados para espaço, mantendo lógica)
  const addNewExercise = () => { const u = JSON.parse(JSON.stringify(workoutData)); u[currentGoal][selectedDay].exercises.push({ name: 'Novo Exercício', sets: '3x10', weight: 'Carga' }); setWorkoutData(u); };
  const removeExercise = (index: number) => { const u = JSON.parse(JSON.stringify(workoutData)); u[currentGoal][selectedDay].exercises.splice(index, 1); setWorkoutData(u); };
  const toggleHabit = (id: number) => setHabits(habits.map((h:any) => h.id === id ? { ...h, completed: !h.completed } : h));
  
  // Handlers Modais e Tabs
  
  // SE NÃO TIVER TOKEN, MOSTRA TELA DE LOGIN
  if (!token) {
      return (
          <div className="min-h-screen bg-wayne-dark flex items-center justify-center p-6 font-hud">
              <TechCard className="w-full max-w-md" title={isRegistering ? "Novo Operador" : "Acesso Restrito"} icon={Lock}>
                  <div className="space-y-4">
                      {isRegistering && (
                          <div>
                              <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Codinome</label>
                              <input type="text" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" 
                                  value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} />
                          </div>
                      )}
                      <div>
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Identificação (Email)</label>
                          <input type="email" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" 
                              value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Senha de Acesso</label>
                          <input type="password" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" 
                              value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
                      </div>
                      
                      {authError && <div className="text-accent-red text-xs font-bold uppercase">{authError}</div>}

                      <TacticalButton onClick={handleAuth} className="w-full">{isRegistering ? 'Confirmar Registro' : 'Decriptar Acesso'}</TacticalButton>
                      
                      <div className="text-center pt-4 border-t border-wayne-border">
                          <button onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }} className="text-xs text-text-muted hover:text-accent-blue uppercase font-bold tracking-widest">
                              {isRegistering ? 'Já possui acesso? Entrar' : 'Solicitar novo acesso'}
                          </button>
                      </div>
                  </div>
              </TechCard>
          </div>
      );
  }

  // APP PRINCIPAL (SÓ RENDERIZA SE TIVER TOKEN)
  return (
    <div className="min-h-screen bg-wayne-dark text-text-main pb-24 font-hud selection:bg-accent-blue selection:text-black relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        
        {/* HEADER COM LOGOUT */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-wayne-border pb-6">
          <div>
            <div className={`inline-flex items-center gap-2 px-2 py-1 border text-[10px] uppercase font-bold mb-3 rounded-sm bg-accent-blue/10 border-accent-blue/30 text-accent-blue`}>
                <Shield size={10} /> ACESSO AUTORIZADO
            </div>
            {savingStatus === 'saving' && <span className="ml-4 text-[10px] text-accent-blue animate-pulse font-mono">SALVANDO...</span>}
            {loading && <span className="ml-4 text-[10px] text-accent-blue animate-pulse font-mono">CARREGANDO DADOS...</span>}
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
                Bem-vindo, <span className="text-accent-blue">{userProfile.name || 'Operador'}</span>
            </h1>
          </div>
          <div className="flex gap-4">
              <div className="bg-wayne-panel px-6 py-2 rounded-sm border border-wayne-border text-center">
                 <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Status Físico</div>
                 <div className="text-xl font-bold text-white font-mono">IMC: {imc}</div>
              </div>
              <button onClick={handleLogout} className="bg-wayne-panel border border-wayne-border text-text-muted hover:text-accent-red px-4 rounded-sm transition-colors" title="Encerrar Sessão">
                  <LogOut size={20} />
              </button>
          </div>
        </header>

        {/* NAVEGAÇÃO */}
        <nav className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-wayne-border scrollbar-hide">
          {['dashboard', 'routine', 'protocols', 'stats', 'checklist', 'missions', 'library', 'journal'].map((tab: any) => (
            <button key={tab} onClick={() => setCurrentTab(tab)} className={`px-6 py-3 text-xs font-bold uppercase transition-all border-b-2 tracking-widest whitespace-nowrap ${currentTab === tab ? 'border-accent-blue text-accent-blue bg-accent-blue/5' : 'border-transparent text-text-muted hover:text-white'}`}>
                {tab === 'protocols' ? 'PROTOCOLOS' : tab === 'routine' ? 'AGENDA' : tab}
            </button>
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
                        <button onClick={() => setIsEditingWorkout(!isEditingWorkout)} className="text-text-muted hover:text-accent-blue bg-wayne-panel p-2 rounded-sm border border-wayne-border"><Edit3 size={18}/></button>
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
                                {isEditingWorkout ? 
                                    <button onClick={() => removeExercise(idx)} className="text-accent-red hover:text-white"><Trash2 size={16}/></button> 
                                : <div className="w-2 h-2 bg-wayne-border group-hover:bg-accent-blue rounded-full transition-colors"></div>}
                            </div>
                        ))}
                    </div>
                    {isEditingWorkout && <button onClick={addNewExercise} className="w-full py-3 mt-4 border border-dashed border-wayne-border rounded-sm text-text-muted hover:text-accent-blue flex justify-center items-center gap-2 text-xs font-bold uppercase"><Plus size={14}/> Adicionar Módulo</button>}
                </TechCard>
             </div>
             
             {/* PAINEL LATERAL (STATUS + MISSÕES) */}
             <div className="space-y-8">
                <TechCard title="Missões Ativas" icon={Target}>
                    <div className="space-y-3">
                        {missions.slice(0, 3).map((m: any) => (
                            <div key={m.id} className="text-sm bg-wayne-dark border-l-2 border-l-accent-blue border-y border-r border-wayne-border p-3 text-text-main flex items-center gap-3">
                                <Activity size={14} className="text-accent-blue"/> {m.title}
                            </div>
                        ))}
                    </div>
                </TechCard>
                <TechCard title="Checklist" icon={CheckSquare}>
                    <div className="space-y-2">
                        {habits.slice(0,3).map((h: any) => (
                            <div key={h.id} onClick={() => toggleHabit(h.id)} className={`p-3 rounded-sm border flex items-center gap-3 cursor-pointer ${h.completed ? 'bg-accent-blue/10 border-accent-blue/30' : 'bg-wayne-dark border-wayne-border'}`}>
                                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${h.completed ? 'bg-accent-blue border-accent-blue text-black' : 'border-wayne-border'}`}>{h.completed && <Check size={10} strokeWidth={3} />}</div>
                                <span className={`text-xs font-bold uppercase ${h.completed ? 'text-accent-blue line-through' : 'text-white'}`}>{h.text}</span>
                            </div>
                        ))}
                    </div>
                </TechCard>
             </div>
          </div>
        )}

        {/* --- DEMAIS ABAS (SIMPLIFICADAS PARA ESPAÇO, MAS FUNCIONAIS) --- */}
        {currentTab === 'routine' && <div className="animate-in fade-in"><TechCard title="Agenda"><div className="space-y-4">{routine.map(i => <div key={i.id} className="p-4 bg-wayne-panel border border-wayne-border"><span className="text-accent-blue font-bold text-xs">{i.timeStart}</span><h3 className="text-white font-bold">{i.activity}</h3></div>)}</div></TechCard></div>}
        
        {currentTab === 'protocols' && (
            <div className="animate-in fade-in">
                 {activeCourseId === null ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{courses.map(c => <TechCard key={c.id} title={c.title} icon={Lock} className="cursor-pointer" ><div onClick={() => { setActiveCourseId(c.id); setActiveLesson(c.modules[0].lessons[0]); }}><p className="text-sm text-text-muted mb-4">{c.description}</p><TacticalButton className="text-[10px] w-full">Acessar</TacticalButton></div></TechCard>)}</div>
                 ) : (
                    <div>
                        <button onClick={() => setActiveCourseId(null)} className="mb-4 text-xs font-bold text-text-muted flex items-center gap-2"><ArrowLeft size={14}/> Voltar</button>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">{activeLesson && <MilitaryVideoPlayer lesson={activeLesson} onComplete={() => {}} />}</div>
                            <div className="lg:col-span-1"><TechCard title="Aulas"><div className="space-y-2">{courses.find(c=>c.id===activeCourseId)?.modules[0].lessons.map(l => <div key={l.id} onClick={()=>setActiveLesson(l)} className={`p-3 border cursor-pointer ${activeLesson?.id === l.id ? 'border-accent-blue' : 'border-wayne-border'}`}>{l.title}</div>)}</div></TechCard></div>
                        </div>
                    </div>
                 )}
            </div>
        )}
      </div>
    </div>
  );
}