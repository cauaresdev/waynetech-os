import { useState, useEffect } from 'react';
import { 
  BrainCircuit, Zap, Clock, BookOpen, Plus, Trash2, 
  ChevronRight, ChevronLeft, Save, Code, Eye, Maximize2,
  Database, FileText, Search, Cpu, Terminal
} from 'lucide-react';

// --- TIPOS ---
interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  tag: 'code' | 'math' | 'history' | 'general';
  date: string;
}

interface BookItem {
  id: number;
  title: string;
  category: string;
  filename: string;
}

type AppMode = 'focus' | 'flashcards' | 'database' | 'library';

// --- CONFIGURAÇÃO VISUAL (TACTICAL BLUE) ---
const THEME = {
    bg_main: "bg-[#0f1014]",
    panel_bg: "bg-[#1a1c23]", 
    panel_border: "border-[#2c2f3a]", 
    accent: "text-[#38bdf8]", 
    btn_primary: "bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]"
};

// --- COMPONENTES VISUAIS ---
const TechCard = ({ children, className = "", title, icon: Icon, active = false }: any) => (
  <div className={`relative overflow-hidden rounded-sm border transition-all duration-300 ${active ? 'border-accent-blue bg-accent-blue/5' : `${THEME.panel_border} ${THEME.panel_bg} hover:border-accent-blue/30`} backdrop-blur-sm ${className}`}>
    {/* Cantos Táticos */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10"></div>

    <div className="relative z-10 p-6 h-full flex flex-col">
      {title && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3 font-hud">
             {Icon && <Icon size={18} className={active ? 'text-accent-blue' : 'text-text-secondary'} />} 
             {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  </div>
);

const TacticalButton = ({ children, onClick, variant = 'primary', className = "" }: any) => (
    <button onClick={onClick} className={`px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-2 font-hud ${variant === 'primary' ? THEME.btn_primary : 'bg-transparent border border-wayne-border[#2c2f3a] hover:border-accent-blue text-text-muted[#94a3b8] hover:text-white'} ${className}`}>
        {children}
    </button>
);

// --- APP ORACLE ---
export default function OracleApp() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AppMode>('flashcards');

  // --- FLASHCARDS STATE ---
  const [cards, setCards] = useState<Flashcard[]>(() => {
      const s = localStorage.getItem('oracle_cards');
      return s ? JSON.parse(s) : [{id: 1, question: 'Definição de Reta', answer: 'Conjunto infinito de pontos alinhados em uma única direção.'}];
  });
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [studyIndex, setStudyIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // --- OUTROS STATES ---
  const [library] = useState<BookItem[]>([
      { id: 1, title: 'Matemática Avançada Vol. 1', category: 'EXATAS', filename: 'matematica.pdf' },
      { id: 2, title: 'História Militar', category: 'HUMANAS', filename: 'historia.pdf' },
  ]);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [notes, setNotes] = useState<Note[]>(() => {
      const s = localStorage.getItem('oracle_notes');
      return s ? JSON.parse(s) : [];
  });
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  // --- PERSISTÊNCIA ---
  useEffect(() => { localStorage.setItem('oracle_cards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => { localStorage.setItem('oracle_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { setTimeout(() => setLoading(false), 1000); }, []);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) setTimerActive(false);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (s: number) => { const mins = Math.floor(s / 60); const secs = s % 60; return `${mins < 10 ? '0'+mins : mins}:${secs < 10 ? '0'+secs : secs}`; };

  // --- FUNÇÕES ---
  const addCard = () => { 
      if(!newQ || !newA) return; 
      const newCard = { id: Date.now(), question: newQ, answer: newA };
      setCards([...cards, newCard]); 
      setNewQ(''); setNewA(''); 
  };
  
  const deleteCard = (id: number) => {
      const newCards = cards.filter(c => c.id !== id);
      setCards(newCards);
      if (studyIndex >= newCards.length) setStudyIndex(Math.max(0, newCards.length - 1));
  };

  const nextCard = () => { 
      if (cards.length === 0) return;
      setStudyIndex((prev) => (prev + 1) % cards.length); 
      setShowAnswer(false); 
  };

  const prevCard = () => {
      if (cards.length === 0) return;
      setStudyIndex((prev) => (prev - 1 + cards.length) % cards.length);
      setShowAnswer(false);
  };

  const addNote = () => { if(!noteTitle) return; setNotes([{ id: Date.now(), title: noteTitle, content: noteContent, tag: 'general', date: new Date().toLocaleDateString('pt-BR') }, ...notes]); setNoteTitle(''); setNoteContent(''); };

  if (loading) {
    return (
        <div className="min-h-screen bg-wayne-dark flex items-center justify-center flex-col gap-6 font-hud">
           <div className="relative w-20 h-20 bg-accent-blue/10 rounded-sm border border-accent-blue/50 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.2)]">
               <BrainCircuit size={32} className="text-accent-blue animate-pulse" />
           </div>
           <div className="text-xl font-bold text-white tracking-[0.3em] font-hud">WAYNE <span className="text-accent-blue">ORACLE</span></div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-wayne-dark text-text-primary font-hud selection:bg-accent-blue selection:text-black pb-20 overflow-x-hidden">
      
      {/* Background Tático */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-wayne-border pb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-accent-blue">
                    <BrainCircuit size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight uppercase">Oracle System</h1>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Base de Conhecimento</p>
                </div>
            </div>
            <div className="flex bg-wayne-panel p-1 rounded-sm border border-wayne-border">
                {[ {id: 'flashcards', label: 'Flash_Mem', icon: Zap}, {id: 'library', label: 'Arquivos', icon: BookOpen}, {id: 'focus', label: 'Timer', icon: Clock}, {id: 'database', label: 'Dados', icon: Database} ].map((item) => (
                    <button key={item.id} onClick={() => setMode(item.id as AppMode)} className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-all uppercase text-[10px] font-bold tracking-wider ${mode === item.id ? 'bg-accent-blue text-black shadow-lg' : 'text-text-muted hover:text-white hover:bg-wayne-panel'}`}>
                        <item.icon size={14}/> {item.label}
                    </button>
                ))}
            </div>
        </header>

        {mode === 'flashcards' && (
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
                <div className="lg:col-span-8">
                    {cards.length > 0 ? (
                        <div className="h-125 perspective-1000 relative group cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
                            <div className={`w-full h-full relative preserve-3d transition-all duration-500 ${showAnswer ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                                {/* FRENTE: PERGUNTA */}
                                <div className="absolute inset-0 backface-hidden">
                                    <div className="w-full h-full bg-wayne-panel border border-wayne-border rounded-sm flex flex-col items-center justify-center p-12 text-center relative overflow-hidden group-hover:border-accent-blue/50 transition-colors shadow-2xl">
                                        <div className="absolute top-4 left-4 text-xs font-bold text-accent-blue uppercase tracking-widest font-mono">DADO {studyIndex + 1} / {cards.length}</div>
                                        <Cpu size={128} className="text-wayne-border absolute opacity-20 animate-pulse"/>
                                        <h3 className="text-3xl font-bold text-white leading-tight uppercase relative z-10">
                                            {cards[studyIndex]?.question}
                                        </h3>
                                        <div className="absolute bottom-8 text-[10px] text-text-muted flex items-center gap-2 uppercase tracking-widest"><Eye size={14}/> Acessar Resposta</div>
                                    </div>
                                </div>
                                {/* VERSO: RESPOSTA */}
                                <div className="absolute inset-0 backface-hidden rotate-y-180" style={{ transform: 'rotateY(180deg)' }}>
                                    <div className="w-full h-full bg-accent-blue/10 backdrop-blur-md border border-accent-blue rounded-sm flex flex-col items-center justify-center p-12 text-center">
                                        <div className="text-xs font-bold text-accent-blue uppercase tracking-widest mb-6">Dado Descriptografado</div>
                                        <p className="text-2xl font-medium text-white leading-relaxed whitespace-pre-wrap font-mono">
                                            {cards[studyIndex]?.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[125] flex items-center justify-center border-2 border-dashed border-wayne-border rounded-sm text-text-muted uppercase font-bold text-sm bg-wayne-panel/50">
                            Banco de dados vazio
                        </div>
                    )}
                    
                    <div className="mt-8 flex justify-center gap-4">
                        <TacticalButton onClick={prevCard} variant="ghost"><ChevronLeft size={16}/></TacticalButton>
                        <TacticalButton onClick={nextCard} variant="ghost">Próximo <ChevronRight size={16}/></TacticalButton>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <TechCard title="Inserção de Dados" icon={Plus}>
                        <div className="space-y-3">
                            <input className="w-full bg-wayne-panel p-3 rounded-sm border border-wayne-border text-white outline-none focus:border-accent-blue" placeholder="PARÂMETRO (PERGUNTA)" value={newQ} onChange={e => setNewQ(e.target.value)} />
                            <textarea className="w-full bg-wayne-panel p-3 rounded-sm border border-wayne-border text-white outline-none focus:border-accent-blue h-24 resize-none" placeholder="VALOR (RESPOSTA)" value={newA} onChange={e => setNewA(e.target.value)} />
                            <TacticalButton onClick={addCard} className="w-full">Upload</TacticalButton>
                        </div>
                    </TechCard>

                    <TechCard title="Índice de Memória" icon={Code} className="max-h-[75] overflow-hidden flex flex-col">
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-2">
                            {cards.map((c, idx) => (
                                <div key={c.id} className={`p-3 rounded-sm border flex justify-between items-center group transition-colors cursor-pointer ${idx === studyIndex ? 'bg-accent-blue/10 border-accent-blue/50' : 'bg-wayne-panel border-wayne-border hover:border-accent-blue/30'}`} onClick={() => {setStudyIndex(idx); setShowAnswer(false);}}>
                                    <div className="truncate w-40 text-xs text-text-primary font-bold font-mono uppercase">
                                        <span className="text-accent-blue mr-2">[{idx + 1}]</span> {c.question}
                                    </div>
                                    <button onClick={(e) => {e.stopPropagation(); deleteCard(c.id);}} className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </TechCard>
                </div>
            </main>
        )}

        {mode === 'library' && (
            <main className="h-[calc(100vh-180px)] flex gap-6 animate-in fade-in duration-500">
                <div className="w-1/3 min-w-[75] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <TechCard title="Acervo Digital" icon={BookOpen} className="h-full">
                        <div className="space-y-3">
                            {library.map(book => (
                                <div 
                                    key={book.id} 
                                    onClick={() => setSelectedBook(book)}
                                    className={`p-4 rounded-sm border cursor-pointer transition-all hover:translate-x-1 ${selectedBook?.id === book.id ? 'bg-accent-blue/10 border-accent-blue text-white' : 'bg-wayne-dark[#0f1014] border-wayne-border[#] hover:border-accent-blue/30'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm mb-1 uppercase">{book.title}</h4>
                                        <ChevronRight size={14} className={selectedBook?.id === book.id ? 'text-accent-blue' : 'opacity-0'}/>
                                    </div>
                                    <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-2 flex items-center gap-2">
                                        <FileText size={10}/> {book.category}
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 rounded-sm border border-dashed border-wayne-border text-center bg-wayne-panel/50">
                                <p className="text-[10px] text-text-muted uppercase">Diretório: <span className="text-accent-blue font-mono">/public/books</span></p>
                            </div>
                        </div>
                    </TechCard>
                </div>
                <div className="flex-1 bg-wayne-panel border border-wayne-border rounded-sm overflow-hidden relative shadow-2xl flex flex-col">
                    {selectedBook ? (
                        <>
                            <div className="h-12 bg-wayne-dark border-b border-wayne-border flex items-center justify-between px-6 z-10">
                                <span className="text-xs font-bold text-accent-blue uppercase tracking-widest font-mono flex items-center gap-2"><Search size={14}/> {selectedBook.title}</span>
                                <button onClick={() => window.open(`/books/${selectedBook.filename}`, '_blank')} className="text-text-muted hover:text-white flex items-center gap-2 text-[10px] uppercase font-bold"><Maximize2 size={14}/> Expandir</button>
                            </div>
                            <iframe src={`/books/${selectedBook.filename}`} className="w-full h-full bg-wayne-dark" title="Leitor PDF"/>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                            <BookOpen size={64} className="mb-4 opacity-20"/>
                            <div className="text-sm font-bold uppercase tracking-widest text-text-muted">Selecione um arquivo do terminal</div>
                        </div>
                    )}
                </div>
            </main>
        )}

        {mode === 'focus' && (
            <div className="flex items-center justify-center h-[60vh] animate-in zoom-in-95 duration-500">
                <TechCard className="text-center p-12 min-w-[125]">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.5em] mb-8">Contagem Regressiva de Missão</div>
                    <div className="text-9xl font-mono font-bold text-white mb-8 tracking-tighter tabular-nums text-shadow">{formatTime(timeLeft)}</div>
                    <div className="flex justify-center gap-4">
                        <TacticalButton onClick={() => setTimerActive(!timerActive)} className="w-48 h-16 text-lg">
                            {timerActive ? 'ABORTO TÁTICO' : 'INICIAR FOCO'}
                        </TacticalButton>
                    </div>
                    <div className="mt-8 flex justify-center gap-2">
                        {[5, 25, 50].map(min => (
                             <button key={min} onClick={() => {setTimeLeft(min*60); setTimerActive(false);}} className="px-3 py-1 border border-wayne-border text-text-muted text-xs font-mono hover:bg-accent-blue hover:text-black transition-colors rounded-sm">
                                {min}M
                             </button>
                        ))}
                    </div>
                </TechCard>
            </div>
        )}

        {mode === 'database' && (
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
                <div className="lg:col-span-4 space-y-6">
                    <TechCard title="Novo Registro" icon={Save}>
                        <div className="space-y-4">
                            <input className="w-full bg-wayne-dark p-3 rounded-sm border border-wayne-border text-white outline-none focus:border-accent-blue[#38bdf8]" placeholder="TÍTULO DO ARQUIVO" value={noteTitle} onChange={(e:any) => setNoteTitle(e.target.value)} />
                            <textarea className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-4 text-accent-blue[#38bdf8] font-mono text-xs outline-none h-64 resize-none" placeholder="// Insira os dados aqui..." value={noteContent} onChange={e => setNoteContent(e.target.value)}/>
                            <TacticalButton onClick={addNote} className="w-full">Gravar no Sistema</TacticalButton>
                        </div>
                    </TechCard>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.map(note => (
                        <div key={note.id} className="bg-wayne-panel border border-wayne-border p-4 rounded-sm hover:border-accent-blue[#38bdf8]/50 transition-colors group">
                            <div className="flex justify-between mb-3 border-b border-wayne-border pb-2">
                                <span className="font-bold text-white uppercase text-sm flex items-center gap-2"><Terminal size={14} className="text-accent-blue[#38bdf8]"/> {note.title}</span>
                                <span className="text-[10px] text-text-muted font-mono">{note.date}</span>
                            </div>
                            <p className="text-xs text-text-muted[#94a3b8] font-mono whitespace-pre-wrap">{note.content}</p>
                        </div>
                    ))}
                    {notes.length === 0 && (
                        <div className="col-span-2 text-center py-20 text-wayne-border[#2c2f3a] uppercase font-bold tracking-widest border-2 border-dashed border-wayne-border[#2c2f3a] rounded-sm">
                            Nenhum registro encontrado
                        </div>
                    )}
                </div>
            </main>
        )}

      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2c2f3a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #38bdf8; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .text-shadow { text-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }
      `}</style>
    </div>
  );
}