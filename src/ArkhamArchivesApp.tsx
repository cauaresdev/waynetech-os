import { useState } from 'react';
import { 
  Archive, Terminal, Database, FileCode, 
  Search, Copy, Check, ChevronRight
} from 'lucide-react';

// --- ARQUIVOS DE INTELIGÊNCIA (EXPANDED) ---
const KNOWLEDGE_BASE = [
  // --- REACT TACTICS ---
  {
    id: 'react-01',
    title: 'UseEffect: Fetch de Dados (API)',
    language: 'react',
    category: 'React',
    description: 'Padrão ouro para buscar dados externos (Brother Eye Prep).',
    code: `useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.exemplo.com/dados');
      const data = await response.json();
      setState(data);
    } catch (error) {
      console.error("Falha na conexão:", error);
    }
  };

  fetchData();
}, []); // Array vazio = roda apenas ao montar o componente`
  },
  {
    id: 'react-02',
    title: 'useState: Hook Básico',
    language: 'react',
    category: 'React',
    description: 'Gerenciamento de estado local simples.',
    code: `const [count, setCount] = useState<number>(0);

// Para atualizar com base no valor anterior (Seguro):
setCount(prev => prev + 1);`
  },
  {
    id: 'react-03',
    title: 'Event Handling (Forms)',
    language: 'react',
    category: 'React',
    description: 'Como tipar eventos de input corretamente.',
    code: `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

return <input onChange={handleChange} />;`
  },
  
  // --- TYPESCRIPT ARMORY (EXPANDED) ---
  {
    id: 'ts-01',
    title: 'Interface vs Type',
    language: 'typescript',
    category: 'TypeScript',
    description: 'A fundação da tipagem. Use Interface para objetos, Type para o resto.',
    code: `// Interface (Extensível, melhor para Objetos/Props)
interface Hero {
  name: string;
  gadgets: string[];
}

// Extensão (Herança)
interface Batman extends Hero {
  batmobile: boolean;
}

// Type (Melhor para Uniões, Tuplas e Primitivos)
type PowerScale = 'Low' | 'Medium' | 'Omega Level';
type Coordinates = [number, number]; // Tupla`
  },
  {
    id: 'ts-02',
    title: 'Generics (O Camaleão)',
    language: 'typescript',
    category: 'TypeScript',
    description: 'Criar funções que funcionam com qualquer tipo, mantendo a segurança.',
    code: `// T funciona como uma variável para o Tipo
function identity<T>(arg: T): T {
  return arg;
}

// O TS entende que 'output' é string
let output = identity<string>("WayneTech"); 
let numberOutput = identity<number>(100);

// Generic em Interface (Resposta de API)
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}`
  },
  {
    id: 'ts-03',
    title: 'Utility Types: Pick & Omit',
    language: 'typescript',
    category: 'TypeScript',
    description: 'Ferramentas cirúrgicas para moldar tipos existentes.',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string; // Sensível
}

// Pick: Seleciona APENAS o que você quer
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit: Pega tudo, EXCETO o que você excluiu
type SafeUser = Omit<User, 'passwordHash'>;`
  },
  {
    id: 'ts-04',
    title: 'Utility Types: Partial & Record',
    language: 'typescript',
    category: 'TypeScript',
    description: 'Essencial para updates e dicionários.',
    code: `interface Mission {
  title: string;
  status: string;
}

// Partial: Torna tudo opcional (Ótimo para updates/patches)
const updateMission = (id: number, fields: Partial<Mission>) => {
  // fields pode ter só 'status', ou só 'title', ou nada
};

// Record: Cria objetos mapas (Dicionários)
// Chave = string, Valor = string
const colorMap: Record<string, string> = {
  danger: '#ef4444',
  success: '#10b981',
  // primary: 123 // Erro! Tem que ser string
};`
  },
  {
    id: 'ts-05',
    title: 'Union & Intersection',
    language: 'typescript',
    category: 'TypeScript',
    description: 'Combinando tipos como peças de Lego.',
    code: `type Attacker = { attack: () => void };
type Defender = { defend: () => void };

// Intersection (&): Tem que ter OS DOIS (O Guerreiro Completo)
type Paladin = Attacker & Defender;

// Union (|): Pode ser UM ou OUTRO
type NPC = Attacker | Defender;

// Exemplo Prático: Status de Request
type Status = 'loading' | 'success' | 'error';`
  },
  {
    id: 'ts-06',
    title: 'Async Return Type',
    language: 'typescript',
    category: 'TypeScript',
    description: 'Como tipar o retorno de funções assíncronas (Promises).',
    code: `interface UserData {
  id: number;
  username: string;
}

// A função retorna uma PROMISE que resolve em UserData
async function getUser(id: number): Promise<UserData> {
  const res = await fetch(\`/users/\${id}\`);
  return res.json();
}`
  },

  // --- JAVA (LEGACY SYSTEMS) ---
  {
    id: 'java-01',
    title: 'Boilerplate: Main Class',
    language: 'java',
    category: 'Java',
    description: 'Estrutura inicial de qualquer arquivo Java.',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Sistema Arkham Online");
    }
}`
  },
  {
    id: 'java-02',
    title: 'ArrayList & Loops',
    language: 'java',
    category: 'Java',
    description: 'Listas dinâmicas em Java (Essencial).',
    code: `import java.util.ArrayList;

ArrayList<String> villains = new ArrayList<String>();
villains.add("Joker");
villains.add("Bane");

for (String v : villains) {
    System.out.println("Alvo: " + v);
}`
  },

  // --- SQL (DATA INTELLIGENCE) ---
  {
    id: 'sql-01',
    title: 'Inner Join Tático',
    language: 'sql',
    category: 'SQL',
    description: 'Conectando duas tabelas sem perder dados.',
    code: `SELECT Users.name, Orders.amount
FROM Users
INNER JOIN Orders
ON Users.id = Orders.user_id
WHERE Orders.amount > 100;`
  }
];

// --- VISUAL (CYAN/ICE THEME) ---
const THEME = {
    bg: "bg-[#040b14]",
    sidebar: "bg-[#061221] border-r border-cyan-900/30",
    card: "bg-[#081629]/80 border border-cyan-500/20 hover:border-cyan-400/50",
    text_primary: "text-cyan-100",
    text_accent: "text-cyan-400",
    button_active: "bg-cyan-900/40 text-cyan-300 border-l-2 border-cyan-400",
    code_block: "bg-[#020508] border border-white/5 font-mono text-sm"
};

export default function ArkhamArchivesApp() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Filtro de Inteligência
  const filteredKnowledge = KNOWLEDGE_BASE.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const handleCopy = (code: string) => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen ${THEME.bg} text-slate-300 font-sans flex flex-col md:flex-row overflow-hidden`}>
      
      {/* SIDEBAR DE NAVEGAÇÃO */}
      <aside className={`w-full md:w-64 ${THEME.sidebar} flex flex-col h-[50] md:h-screen z-20`}>
        <div className="p-6 border-b border-cyan-900/30 flex items-center gap-3">
            <Archive size={24} className="text-cyan-400" />
            <div>
                <h1 className="font-bold text-white tracking-widest text-sm">ARKHAM</h1>
                <div className="text-[9px] text-cyan-600 font-bold uppercase">Arquivos de Código</div>
            </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {['All', 'React', 'TypeScript', 'Java', 'SQL'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => {setSelectedCategory(cat); setSelectedSnippet(null);}}
                    className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${selectedCategory === cat ? THEME.button_active : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                    {cat}
                    {selectedCategory === cat && <ChevronRight size={14}/>}
                </button>
            ))}
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-[calc(100vh-200px)] md:h-screen overflow-hidden">
        
        {/* BUSCA SUPERIOR */}
        <header className="p-6 border-b border-cyan-900/30 bg-[#040b14]/95 backdrop-blur-md z-10 flex items-center gap-4">
            <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700" size={18} />
                <input 
                    type="text" 
                    placeholder="Pesquisar protocolo..." 
                    className="w-full bg-[#081629] border border-cyan-900/30 rounded-xl py-3 pl-10 pr-4 text-cyan-100 outline-none focus:border-cyan-500 transition-all text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="text-xs font-mono text-cyan-800 hidden md:block">
                {filteredKnowledge.length} ARQUIVOS ENCONTRADOS
            </div>
        </header>

        {/* CONTEÚDO DIVIDIDO */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* LISTA DE SNIPPETS */}
            <div className={`flex-1 p-6 overflow-y-auto ${selectedSnippet ? 'hidden md:block md:w-1/2 lg:w-1/3 border-r border-cyan-900/30' : 'w-full'}`}>
                <div className="grid gap-4">
                    {filteredKnowledge.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelectedSnippet(item)}
                            className={`p-5 rounded-xl cursor-pointer transition-all group ${THEME.card} ${selectedSnippet?.id === item.id ? 'border-cyan-400 bg-cyan-900/10' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-black/40 ${item.language === 'react' ? 'text-blue-400' : item.language === 'java' ? 'text-orange-400' : item.language === 'typescript' ? 'text-yellow-500' : 'text-purple-400'}`}>
                                    {item.language.toUpperCase()}
                                </span>
                                <FileCode size={16} className="text-cyan-800 group-hover:text-cyan-400 transition-colors"/>
                            </div>
                            <h3 className="font-bold text-white mb-1">{item.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* LEITOR DE CÓDIGO (PREVIEW) */}
            {selectedSnippet ? (
                <div className="flex-1 bg-[#020508] flex flex-col h-full overflow-hidden absolute md:relative inset-0 md:inset-auto z-30 md:z-0">
                    {/* Header do Código */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#061221]">
                        <div>
                            <button onClick={() => setSelectedSnippet(null)} className="md:hidden text-cyan-500 text-xs font-bold mb-2 flex items-center gap-1">
                                <ChevronRight className="rotate-180" size={12}/> VOLTAR
                            </button>
                            <h2 className="font-bold text-cyan-100 flex items-center gap-2">
                                <Terminal size={18} className="text-cyan-500"/> {selectedSnippet.title}
                            </h2>
                        </div>
                        <button 
                            onClick={() => handleCopy(selectedSnippet.code)}
                            className="p-2 rounded-lg bg-cyan-900/20 hover:bg-cyan-500/20 text-cyan-400 transition-all flex items-center gap-2"
                        >
                            {copied ? <Check size={18}/> : <Copy size={18}/>}
                            <span className="text-[10px] font-bold hidden sm:block">{copied ? 'COPIADO' : 'COPIAR'}</span>
                        </button>
                    </div>

                    {/* Área de Código */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="text-xs text-slate-500 mb-4 font-mono">// {selectedSnippet.description}</div>
                        <pre className="font-mono text-sm text-blue-100 leading-relaxed whitespace-pre-wrap">
                            {selectedSnippet.code}
                        </pre>
                    </div>
                </div>
            ) : (
                <div className="flex-1 hidden md:flex items-center justify-center flex-col text-cyan-900/30">
                    <Database size={64} className="mb-4 opacity-50"/>
                    <div className="text-sm font-bold tracking-widest">SELECIONE UM ARQUIVO</div>
                </div>
            )}

        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: #020508; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0e7490; border-radius: 10px; }
      `}</style>
    </div>
  );
}