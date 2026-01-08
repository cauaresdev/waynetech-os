import { useState, useEffect } from 'react';
import { 
    Dumbbell, User, Plus, X, 
    CheckSquare, FileText, Save, 
    Edit3, Activity, Target, Lock, Check, Cpu, BarChart2,
    BookOpen, Library, ArrowLeft, ArrowRight, Trash2,
    Clock, Shield
} from 'lucide-react';
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- CONFIGURAÇÃO DE TIPOS ---
type AppTab = 'dashboard' | 'routine' | 'stats' | 'checklist' | 'missions' | 'journal' | 'library';
interface Exercise { name: string; sets: string; weight: string; }
interface Workout { name: string; exercises: Exercise[]; }
type WorkoutDay = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
type UserGoal = 'hipertrofia' | 'forca' | 'definicao';
type WorkoutPlans = Record<UserGoal, Record<WorkoutDay, Workout>>;
interface Mission { id: number; title: string; status: 'intel' | 'em_curso' | 'neutralizado'; priority: 'alta' | 'normal'; }
interface RoutineItem { id: number; timeStart: string; timeEnd: string; activity: string; category: 'work' | 'training' | 'rest' | 'sustenance'; }

// --- COMPONENTES VISUAIS TÁTICOS ---
const TechCard = ({ children, className = "", title, icon: Icon, active = false, subtitle }: any) => (
  <div className={`relative overflow-hidden rounded-sm border transition-all duration-300 ${active ? 'border-accent-blue bg-accent-blue/5' : `border-wayne-border bg-wayne-panel hover:border-accent-blue/30`} backdrop-blur-sm ${className}`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10"></div>
    
    <div className="relative z-10 p-6 h-full flex flex-col">
      {title && (
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-wayne-border">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3 font-hud">
                {Icon && <Icon size={18} className="text-accent-blue" />} 
                {title}
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

// --- DADOS PADRÃO ---
const defaultWorkoutPlans: WorkoutPlans = {
    hipertrofia: { 
        segunda: { name: 'COSTAS & BÍCEPS', exercises: [{ name: 'Barra Fixa', sets: '5x5', weight: 'BW' }, { name: 'Remada Curvada', sets: '4x8', weight: '60kg' }] }, 
        terca: { name: 'INFERIOR A', exercises: [{ name: 'Agachamento', sets: '5x5', weight: '100kg' }] }, 
        quarta: { name: 'OMBROS', exercises: [{ name: 'Desenv. Militar', sets: '4x8', weight: '40kg' }] }, 
        quinta: { name: 'INFERIOR B', exercises: [{ name: 'Lev. Terra', sets: '3x5', weight: '120kg' }] }, 
        sexta: { name: 'PEITO & TRÍCEPS', exercises: [{ name: 'Supino Reto', sets: '4x8', weight: '80kg' }] }, 
        sabado: { name: 'CARDIO TÁTICO', exercises: [{ name: 'Corrida', sets: '5km', weight: 'Tempo' }] }, 
        domingo: { name: 'REST DAY', exercises: [] } 
    },
    forca: { segunda: { name: 'Upper', exercises: [] }, terca: { name: 'Lower', exercises: [] }, quarta: { name: 'Rest', exercises: [] }, quinta: { name: 'Upper', exercises: [] }, sexta: { name: 'Lower', exercises: [] }, sabado: { name: 'Rest', exercises: [] }, domingo: { name: 'Rest', exercises: [] } },
    definicao: { segunda: { name: 'Fullbody', exercises: [] }, terca: { name: 'Cardio', exercises: [] }, quarta: { name: 'Fullbody', exercises: [] }, quinta: { name: 'Cardio', exercises: [] }, sexta: { name: 'Fullbody', exercises: [] }, sabado: { name: 'HIIT', exercises: [] }, domingo: { name: 'Rest', exercises: [] } }
};

const defaultRoutine: RoutineItem[] = [
    { id: 1, timeStart: '06:00', timeEnd: '07:00', activity: 'Despertar + Cardio', category: 'training' },
    { id: 2, timeStart: '07:00', timeEnd: '08:00', activity: 'Café + Leitura', category: 'sustenance' },
    { id: 3, timeStart: '08:00', timeEnd: '12:00', activity: 'Deep Work', category: 'work' }
];

const defaultLibrary = [ { id: 1, title: 'A Arte da Guerra', author: 'Sun Tzu', status: 'lido' } ];
const defaultHabits = [ { id: 1, text: 'Beber 4L Água', completed: false }, { id: 2, text: 'Creatina', completed: false }, { id: 3, text: 'Dormir 8h', completed: false } ];
const defaultMissions: Mission[] = [ { id: 1, title: 'Aprender Backend', status: 'intel', priority: 'alta' }, { id: 2, title: 'Aumentar Cargas 20%', status: 'em_curso', priority: 'normal' } ];

export default function BatmanWorkoutDashboard() {
  const [loading, setLoading] = useState(true);
  
  // STATES
  const [userProfile, setUserProfile] = useState(() => { const s = localStorage.getItem('bat_profile_v2'); return s ? JSON.parse(s) : { name: '', weight: '', goal: 'hipertrofia' }; });
  const [currentView, setCurrentView] = useState(() => userProfile.name ? 'dashboard' : 'quiz');
  
  const [workoutData, setWorkoutData] = useState<WorkoutPlans>(() => { const s = localStorage.getItem('bat_workouts'); return s ? JSON.parse(s) : defaultWorkoutPlans; });
  const [routine] = useState<RoutineItem[]>(() => { const s = localStorage.getItem('bat_routine'); return s ? JSON.parse(s) : defaultRoutine; });
  const [weightHistory, setWeightHistory] = useState(() => { const s = localStorage.getItem('bat_weight_history'); return s ? JSON.parse(s) : [{date:'01/01', weight:70}]; });
  
  // STATES EXTRAS
  const [missions, setMissions] = useState<Mission[]>(() => { const s = localStorage.getItem('bat_missions'); return s ? JSON.parse(s) : defaultMissions; });
  const [habits, setHabits] = useState(() => { const s = localStorage.getItem('bat_habits'); return s ? JSON.parse(s) : defaultHabits; });
  const [library, setLibrary] = useState(() => { const s = localStorage.getItem('bat_library'); return s ? JSON.parse(s) : defaultLibrary; });
  const [journal, setJournal] = useState(() => { const s = localStorage.getItem('bat_journal'); return s ? JSON.parse(s) : []; });

  // UI States
  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay>('segunda');
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState('');
  
  // State do Modal de Leitura (CORREÇÃO)
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<any>(null);

  // Inputs Extras
  const [newHabitText, setNewHabitText] = useState('');
  const [newMissionText, setNewMissionText] = useState('');
  const [journalInput, setJournalInput] = useState('');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  // Handlers
  const currentGoal: UserGoal = (userProfile.goal as UserGoal) || 'hipertrofia';
  const currentWorkout = workoutData[currentGoal][selectedDay]; 
  const imc = (parseFloat(userProfile.weight) && parseFloat(userProfile.height)) ? (parseFloat(userProfile.weight) / ((parseFloat(userProfile.height)/100)**2)).toFixed(1) : 'N/A';

  const handleQuizSubmit = () => { if (userProfile.name) setCurrentView('dashboard'); };
  
  // Persistência
  useEffect(() => { setTimeout(() => setLoading(false), 1000); }, []);
  useEffect(() => { localStorage.setItem('bat_workouts', JSON.stringify(workoutData)); }, [workoutData]);
  useEffect(() => { localStorage.setItem('bat_missions', JSON.stringify(missions)); }, [missions]);
  useEffect(() => { localStorage.setItem('bat_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('bat_library', JSON.stringify(library)); }, [library]);
  useEffect(() => { localStorage.setItem('bat_journal', JSON.stringify(journal)); }, [journal]);

  // Funções de Edição
  const handleExerciseChange = (exIndex: number, field: keyof Exercise, value: string) => { 
      const u = JSON.parse(JSON.stringify(workoutData));
      u[currentGoal][selectedDay].exercises[exIndex][field] = value; 
      setWorkoutData(u); 
  };
  const addNewExercise = () => { 
      const u = JSON.parse(JSON.stringify(workoutData));
      u[currentGoal][selectedDay].exercises.push({ name: 'Novo Exercício', sets: '3x10', weight: 'Carga' }); 
      setWorkoutData(u); 
  };
  const removeExercise = (index: number) => { 
      const u = JSON.parse(JSON.stringify(workoutData));
      u[currentGoal][selectedDay].exercises.splice(index, 1); 
      setWorkoutData(u); 
  };
  const handleAddWeight = () => { 
      if(newWeightInput) { 
          setWeightHistory([...weightHistory, {date: new Date().toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'}), weight: parseFloat(newWeightInput)}]); 
          setUserProfile({...userProfile, weight: newWeightInput}); setNewWeightInput(''); 
      }
  };

  // Funções Extras (Checklist, Missões, etc)
  const toggleHabit = (id: number) => setHabits(habits.map((h:any) => h.id === id ? { ...h, completed: !h.completed } : h));
  const addHabit = () => { if (newHabitText) { setHabits([...habits, { id: Date.now(), text: newHabitText, completed: false }]); setNewHabitText(''); } };
  const addMission = () => { if (newMissionText) { setMissions([...missions, { id: Date.now(), title: newMissionText, status: 'intel', priority: 'normal' }]); setNewMissionText(''); } };
  const deleteMission = (id: number) => setMissions(missions.filter((m:any) => m.id !== id));
  const moveMission = (id: number, direction: 'next' | 'prev') => { 
      const mission = missions.find(m => m.id === id); if (!mission) return; 
      const statusFlow: Mission['status'][] = ['intel', 'em_curso', 'neutralizado']; 
      const idx = statusFlow.indexOf(mission.status); 
      let newIndex = direction === 'next' ? idx + 1 : idx - 1; 
      if (newIndex < 0) newIndex = 0; if (newIndex >= statusFlow.length) newIndex = statusFlow.length - 1; 
      setMissions(missions.map(m => m.id === id ? { ...m, status: statusFlow[newIndex] } : m)); 
  };
  const handleAddBook = () => { if(newBook.title) { setLibrary([...library, { ...newBook, id: Date.now(), status: 'lido' }]); setIsAddBookModalOpen(false); } };
  const handleRemoveBook = (id: number) => setLibrary(library.filter((b:any) => b.id !== id));
  const addJournalEntry = () => { if(journalInput) { setJournal([{id: Date.now(), date: new Date().toLocaleDateString(), content: journalInput}, ...journal]); setJournalInput(''); }};

  if (loading) {
    return (
        <div className="min-h-screen bg-wayne-dark flex items-center justify-center flex-col gap-6">
           <div className="relative w-20 h-20 bg-accent-blue/10 rounded-sm border border-accent-blue/50 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.2)]">
               <Cpu size={32} className="text-accent-blue animate-pulse" />
           </div>
           <div className="text-xl font-bold text-white tracking-[0.3em] font-hud">BAT-OS <span className="text-accent-blue">SYSTEMS</span></div>
        </div>
    )
  }

  if (currentView === 'quiz') {
    return (
      <div className="min-h-screen bg-wayne-dark flex items-center justify-center p-6 font-hud">
        <TechCard className="w-full max-w-lg" title="Identificação de Operador" icon={Lock} subtitle="Acesso Inicial">
            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Codinome</label>
                    <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-4 text-white focus:border-accent-blue outline-none" placeholder="Digite seu nome..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Altura (cm)" value={userProfile.height} onChange={(e) => setUserProfile({...userProfile, height: e.target.value})} className="bg-wayne-dark border border-wayne-border p-3 rounded-sm text-white outline-none focus:border-accent-blue"/>
                    <input type="number" placeholder="Peso (kg)" value={userProfile.weight} onChange={(e) => setUserProfile({...userProfile, weight: e.target.value})} className="bg-wayne-dark border border-wayne-border p-3 rounded-sm text-white outline-none focus:border-accent-blue"/>
                </div>
                <TacticalButton onClick={handleQuizSubmit} className="w-full">Inicializar Sistema</TacticalButton>
            </div>
        </TechCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wayne-dark text-text-main pb-24 font-hud selection:bg-accent-blue selection:text-black relative overflow-x-hidden">
      
      {/* Background Tático */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-wayne-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-accent-blue/10 border border-accent-blue/30 text-[10px] uppercase font-bold text-accent-blue mb-3 rounded-sm">
                <Shield size={10} /> Sistema Operacional
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">
                Bem-vindo, <span className="text-accent-blue">{userProfile.name || 'Operador'}</span>
            </h1>
          </div>
          <div className="bg-wayne-panel px-6 py-2 rounded-sm border border-wayne-border text-center">
             <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Status Físico</div>
             <div className="text-xl font-bold text-white font-mono">IMC: {imc}</div>
          </div>
        </header>

        {/* NAVEGAÇÃO COMPLETA */}
        <nav className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-wayne-border scrollbar-hide">
          {['dashboard', 'routine', 'stats', 'checklist', 'missions', 'library', 'journal'].map((tab: any) => (
            <button key={tab} onClick={() => setCurrentTab(tab)} className={`px-6 py-3 text-xs font-bold uppercase transition-all border-b-2 tracking-widest whitespace-nowrap ${currentTab === tab ? 'border-accent-blue text-accent-blue bg-accent-blue/5' : 'border-transparent text-text-muted hover:text-white'}`}>
                {tab === 'routine' ? 'AGENDA' : tab}
            </button>
          ))}
        </nav>

        {currentTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-2">
                <TechCard title="Protocolo de Treino" icon={Dumbbell} subtitle="Sequência de Combate">
                    <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                        {Object.keys(workoutData[currentGoal]).map((day: any) => (
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
                                                <input className="bg-wayne-panel p-2 rounded-sm text-white text-sm border border-wayne-border" value={ex.name} onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)} />
                                                <input className="bg-wayne-panel p-2 rounded-sm text-text-muted text-xs border border-wayne-border" value={ex.sets} onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)} />
                                                <input className="bg-wayne-panel p-2 rounded-sm text-accent-blue text-xs border border-wayne-border" value={ex.weight} onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)} />
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
                        {isEditingWorkout && (
                            <button onClick={addNewExercise} className="w-full py-3 border border-dashed border-wayne-border rounded-sm text-text-muted hover:text-accent-blue hover:border-accent-blue/50 flex justify-center items-center gap-2 text-xs font-bold uppercase transition-all">
                                <Plus size={14}/> Adicionar Módulo
                            </button>
                        )}
                    </div>
                </TechCard>
             </div>
             
             <div className="space-y-8">
                <TechCard title="Status do Operador" icon={User}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-wayne-dark p-4 rounded-sm text-center border border-wayne-border">
                            <div className="text-[10px] uppercase font-bold text-text-muted">Peso</div>
                            <div className="text-2xl font-bold text-white font-mono">{userProfile.weight || 0} <span className="text-sm text-accent-blue">kg</span></div>
                        </div>
                        <div className="bg-wayne-dark p-4 rounded-sm text-center border border-wayne-border">
                            <div className="text-[10px] uppercase font-bold text-text-muted">Proteína</div>
                            <div className="text-2xl font-bold text-white font-mono">160 <span className="text-sm text-accent-purple">g</span></div>
                        </div>
                    </div>
                </TechCard>
                <TechCard title="Missões Ativas" icon={Target}>
                    <div className="space-y-3">
                        {missions.slice(0, 3).map((m: any) => (
                            <div key={m.id} className="text-sm bg-wayne-dark border-l-2 border-l-accent-blue border-y border-r border-wayne-border p-3 text-text-main flex items-center gap-3">
                                <Activity size={14} className="text-accent-blue"/> {m.title}
                            </div>
                        ))}
                    </div>
                </TechCard>
             </div>
          </div>
        )}

        {currentTab === 'routine' && (
            <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3 uppercase"><Clock size={24} className="text-accent-blue" /> Agenda Operacional</h2>
                </div>
                <div className="space-y-6 relative pl-4">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-accent-blue to-transparent"></div>
                    {routine.map((item) => (
                        <div key={item.id} className="relative pl-12 transition-all duration-500">
                            <div className="absolute left-0 w-12 h-12 rounded-sm flex items-center justify-center border-2 z-10 bg-wayne-dark border-accent-blue text-accent-blue shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                                <Activity size={20} />
                            </div>
                            <div className="p-5 rounded-sm border bg-wayne-panel border-wayne-border">
                                <div className="text-xs font-bold uppercase tracking-widest mb-1 text-accent-blue">{item.timeStart} - {item.timeEnd}</div>
                                <h3 className="text-lg font-bold uppercase text-white">{item.activity}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {currentTab === 'stats' && (
            <div className="animate-in fade-in duration-500">
                <TechCard title="Evolução de Carga" icon={BarChart2} subtitle="Análise de Dados">
                    <div className="h-[75] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weightHistory}>
                                <defs>
                                    <linearGradient id="colorW" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2c2f3a" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 10}} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 10}} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                                <Tooltip contentStyle={{backgroundColor: '#0f1014', border: '1px solid #2c2f3a'}} />
                                <Area type="monotone" dataKey="weight" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorW)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 flex gap-4">
                        <input type="number" placeholder="Peso Atual (kg)" className="bg-wayne-dark border border-wayne-border rounded-sm px-4 text-white outline-none focus:border-accent-blue w-full" value={newWeightInput} onChange={e => setNewWeightInput(e.target.value)} />
                        <TacticalButton onClick={handleAddWeight}>Atualizar</TacticalButton>
                    </div>
                </TechCard>
            </div>
        )}

        {currentTab === 'checklist' && (
            <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
                <TechCard title="Checklist Diário" icon={CheckSquare} subtitle="Rotina Obrigatória">
                    <div className="space-y-2 mb-6">
                        {habits.map((h: any) => (
                            <div key={h.id} onClick={() => toggleHabit(h.id)} className={`p-4 rounded-sm border flex items-center gap-4 cursor-pointer transition-all ${h.completed ? 'bg-accent-blue/10 border-accent-blue/30' : 'bg-wayne-dark border-wayne-border hover:border-accent-blue/50'}`}>
                                <div className={`w-6 h-6 rounded-sm flex items-center justify-center border ${h.completed ? 'bg-accent-blue border-accent-blue text-black' : 'border-wayne-border text-wayne-border'}`}>
                                    {h.completed && <Check size={14} strokeWidth={3} />}
                                </div>
                                <span className={`text-sm font-bold uppercase tracking-wide ${h.completed ? 'text-accent-blue line-through' : 'text-white'}`}>{h.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Nova Tarefa..." className="flex-1 bg-wayne-dark border border-wayne-border rounded-sm px-4 text-white outline-none focus:border-accent-blue" value={newHabitText} onChange={e => setNewHabitText(e.target.value)} onKeyPress={e => e.key === 'Enter' && addHabit()} />
                        <TacticalButton onClick={addHabit}><Plus size={20}/></TacticalButton>
                    </div>
                </TechCard>
            </div>
        )}

        {currentTab === 'missions' && (
            <div className="animate-in fade-in duration-500 h-[calc(100vh-220px)]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3 uppercase"><Target size={24} className="text-accent-blue" /> Quadro de Missões</h2>
                    <div className="flex gap-3">
                        <input type="text" placeholder="Nova Missão..." className="bg-wayne-panel border border-wayne-border rounded-sm px-4 py-2 text-sm text-white focus:border-accent-blue outline-none w-64" value={newMissionText} onChange={e => setNewMissionText(e.target.value)} onKeyPress={e => e.key === 'Enter' && addMission()}/>
                        <button onClick={addMission} className="bg-accent-blue hover:bg-accent-blue-dim text-black p-2 rounded-sm transition-colors"><Plus size={20}/></button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                    {['intel', 'em_curso', 'neutralizado'].map(column => {
                        const colors: any = { intel: 'bg-accent-purple', em_curso: 'bg-accent-blue', neutralizado: 'bg-text-muted' };
                        const colColor = colors[column];
                        return (
                        <div key={column} className="bg-wayne-panel/50 border border-wayne-border rounded-sm p-4 flex flex-col h-full backdrop-blur-md">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${colColor}`}></div>
                                {column.replace('_', ' ')} <span className="ml-auto bg-wayne-border px-2 py-0.5 rounded text-white text-[10px]">{missions.filter(m => m.status === column).length}</span>
                            </h3>
                            <div className="space-y-3 overflow-y-auto flex-1">
                                {missions.filter(m => m.status === column).map(mission => (
                                    <div key={mission.id} className={`bg-wayne-dark border border-wayne-border rounded-sm p-4 hover:border-accent-blue transition-all group ${mission.priority === 'alta' ? 'border-l-4 border-l-accent-red' : ''}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-sm font-bold text-white leading-tight uppercase">{mission.title}</span>
                                            <button onClick={() => deleteMission(mission.id)} className="text-text-muted hover:text-accent-red opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            {column !== 'intel' ? <button onClick={() => moveMission(mission.id, 'prev')} className="text-text-muted hover:text-white"><ArrowLeft size={14}/></button> : <div></div>}
                                            {mission.priority === 'alta' && <span className="text-[10px] bg-accent-red/20 text-accent-red px-2 py-0.5 rounded font-bold uppercase">Alta Prioridade</span>}
                                            {column !== 'neutralizado' ? <button onClick={() => moveMission(mission.id, 'next')} className="text-text-muted hover:text-white"><ArrowRight size={14}/></button> : <div></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        )}

        {currentTab === 'library' && (
             <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3 uppercase"><Library size={24} className="text-accent-purple" /> Biblioteca</h2>
                    <TacticalButton onClick={() => setIsAddBookModalOpen(true)} className="flex items-center gap-2"><Plus size={16}/> Inserir Dados</TacticalButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {library.map((book: any) => (
                        <div key={book.id} className="bg-wayne-panel border border-wayne-border rounded-sm p-6 group hover:border-accent-blue transition-all relative flex flex-col justify-between h-48 hover:shadow-lg">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleRemoveBook(book.id)} className="text-text-muted hover:text-accent-red"><X size={16}/></button></div>
                            <div>
                                <BookOpen size={24} className="text-text-muted mb-4 group-hover:text-accent-blue transition-colors"/>
                                <h4 className="text-lg font-bold text-white mb-1 line-clamp-2 leading-tight uppercase">{book.title}</h4>
                                <p className="text-xs text-text-muted font-bold uppercase">{book.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {currentTab === 'journal' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-500 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <TechCard title="Registro de Campo" icon={FileText}>
                        <div className="bg-wayne-dark rounded-sm p-6 border border-wayne-border mb-6">
                            <div className="text-xs text-accent-blue font-bold mb-4 uppercase tracking-wider">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                            <textarea className="w-full h-72 bg-transparent text-base text-text-main font-sans focus:outline-none resize-none placeholder-wayne-border leading-relaxed" placeholder="Relatório de progresso..." value={journalInput} onChange={e => setJournalInput(e.target.value)}/>
                        </div>
                        <TacticalButton onClick={addJournalEntry} className="w-full">Salvar Log <Save size={16}/></TacticalButton>
                    </TechCard>
                </div>
                <div className="h-[150]">
                    <TechCard title="Histórico" icon={Lock} className="h-full">
                        <div className="space-y-3 overflow-y-auto h-[125] custom-scrollbar pr-2">
                            {journal.slice().reverse().map((entry: any) => (
                                <div key={entry.id} onClick={() => setSelectedJournalEntry(entry)} className="p-4 rounded-sm bg-wayne-dark hover:bg-wayne-panel transition-all cursor-pointer group border border-wayne-border hover:border-accent-blue/50">
                                    <div className="text-xs text-text-muted font-bold mb-1 group-hover:text-accent-blue">{entry.date}</div>
                                    <div className="text-sm text-text-main line-clamp-2">{entry.content}</div>
                                </div>
                            ))}
                        </div>
                    </TechCard>
                </div>
            </div>
        )}

        {/* MODAL DE LEITURA DO DIÁRIO */}
        {selectedJournalEntry && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-hud">
            <div className="bg-wayne-panel border border-accent-blue rounded-sm w-full max-w-2xl shadow-2xl relative max-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-wayne-border flex justify-between items-center bg-wayne-dark">
                    <div>
                        <h3 className="font-bold text-white text-lg uppercase tracking-widest">Log Descriptografado</h3>
                        <span className="text-xs text-text-muted font-bold uppercase tracking-wider">{selectedJournalEntry.date}</span>
                    </div>
                    <button onClick={() => setSelectedJournalEntry(null)} className="text-text-muted hover:text-white bg-wayne-panel p-2 rounded-full transition-colors border border-wayne-border"><X size={20}/></button>
                </div>
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-wayne-dark">
                    <p className="text-sm text-text-main leading-relaxed font-medium whitespace-pre-wrap font-sans">{selectedJournalEntry.content}</p>
                </div>
            </div>
        </div>
        )}

        {/* MODAL NOVO LIVRO */}
        {isAddBookModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-hud">
            <div className="bg-wayne-panel border border-accent-blue rounded-sm w-full max-w-md p-6 space-y-4 shadow-2xl">
                <h3 className="font-bold text-white uppercase tracking-widest">Nova Entrada</h3>
                <input type="text" placeholder="Título" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-4 text-white outline-none focus:border-accent-blue" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})}/>
                <input type="text" placeholder="Autor" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-4 text-white outline-none focus:border-accent-blue" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})}/>
                <div className="flex gap-4">
                    <TacticalButton onClick={handleAddBook} className="flex-1">Confirmar</TacticalButton>
                    <button onClick={() => setIsAddBookModalOpen(false)} className="text-text-muted uppercase text-xs font-bold">Cancelar</button>
                </div>
            </div>
        </div>
        )}

      </div>
    </div>
  );
}