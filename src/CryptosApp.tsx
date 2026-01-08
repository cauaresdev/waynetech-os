import { useState, useEffect } from 'react';
import { 
    Shield, Lock, Key, Terminal, RefreshCw, 
    Copy, Eye, EyeOff, Activity, 
    AlertTriangle, Server, Unlock, Cpu, Hash
} from 'lucide-react';

// --- CONFIGURAÇÃO VISUAL (WAYNETECH SEC_OPS) ---
const THEME = {
    bg_main: "bg-[#0f1014]",
    panel_bg: "bg-[#1a1c23]", 
    panel_border: "border-[#2c2f3a]", 
    accent: "text-[#38bdf8]", 
    btn_primary: "bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]"
};

// --- COMPONENTES VISUAIS ---
const TechCard = ({ children, className = "", title, icon: Icon, active = false, status }: any) => (
  <div className={`relative overflow-hidden rounded-sm border transition-all duration-300 ${active ? 'border-accent-blue bg-accent-blue/5' : `${THEME.panel_border} ${THEME.panel_bg} hover:border-accent-blue/30`} backdrop-blur-sm ${className}`}>
    {/* Cantos Táticos */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10"></div>

    <div className="relative z-10 p-6 h-full flex flex-col">
      {title && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-wayne-border">
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3 font-hud">
             {Icon && <Icon size={18} className={active ? 'text-accent-blue' : 'text-text-muted'} />} 
             {title}
          </h3>
          {status && <span className="text-[9px] bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded-sm uppercase font-bold tracking-wider animate-pulse">{status}</span>}
        </div>
      )}
      {children}
    </div>
  </div>
);

const TacticalButton = ({ children, onClick, variant = 'primary', className = "" }: any) => (
    <button onClick={onClick} className={`px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-2 font-hud ${variant === 'primary' ? THEME.btn_primary : 'bg-transparent border border-wayne-border hover:border-accent-blue text-text-muted hover:text-white'} ${className}`}>
        {children}
    </button>
);

export default function CryptosApp() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, keygen, enigma

  // STATES: MARKET
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [marketSentiment, setMarketSentiment] = useState(45); // Fear & Greed Mock

  // STATES: KEYGEN
  const [password, setPassword] = useState('');
  const [passLength, setPassLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  // STATES: ENIGMA
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(true); // true = encrypt, false = decrypt

  // --- EFEITOS ---
  useEffect(() => {
    // Simulação de API de Cripto (Para evitar Rate Limits em demonstração)
    const mockFetch = () => {
        setCryptoData([
            { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 94500.20, change: 2.4 },
            { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3200.50, change: -1.2 },
            { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.80, change: 5.7 },
        ]);
        // Randomizar sentimento para "efeito vivo"
        setMarketSentiment(prev => Math.max(10, Math.min(90, prev + (Math.random() > 0.5 ? 5 : -5))));
    };
    
    mockFetch();
    const interval = setInterval(mockFetch, 5000);
    setTimeout(() => setLoading(false), 1200);
    return () => clearInterval(interval);
  }, []);

  // --- LOGICA: KEYGEN ---
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let validChars = chars;
    if (includeSymbols) validChars += symbols;
    
    let generatedPassword = "";
    for (let i = 0; i < passLength; i++) {
        const randomNumber = Math.floor(Math.random() * validChars.length);
        generatedPassword += validChars.substring(randomNumber, randomNumber + 1);
    }
    setPassword(generatedPassword);
  };

  // --- LOGICA: ENIGMA ---
  const processEnigma = () => {
      if (!inputText) return;
      if (isEncrypting) {
          // Simulação Visual de Criptografia (Base64)
          setOutputText(btoa(inputText));
      } else {
          try {
            setOutputText(atob(inputText));
          } catch (e) {
            setOutputText("ERRO: HASH INVÁLIDO OU CORROMPIDO.");
          }
      }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-wayne-dark flex items-center justify-center flex-col gap-6 font-hud">
           <div className="relative w-20 h-20 bg-accent-blue/10 rounded-sm border border-accent-blue/50 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.2)]">
               <Lock size={32} className="text-accent-blue animate-pulse" />
           </div>
           <div className="text-xl font-bold text-white tracking-[0.3em] font-hud">WAYNE <span className="text-accent-blue">SEC_OPS</span></div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-wayne-dark text-text-primary font-hud selection:bg-accent-blue selection:text-black pb-20 overflow-x-hidden">
      
      {/* Background Tático */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center border-b border-wayne-border pb-6 gap-6">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 uppercase">
                    <Shield className="text-accent-blue" /> Security Operations
                </h1>
                <p className="text-xs text-text-muted font-bold uppercase tracking-[0.2em] mt-1">Criptografia & Inteligência de Mercado</p>
            </div>
            
            <div className="flex bg-wayne-panel p-1 rounded-sm border border-wayne-border">
                {['dashboard', 'keygen', 'enigma'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${activeTab === tab ? 'bg-accent-blue text-black shadow-lg' : 'text-text-muted hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </header>

        {/* --- VIEW: DASHBOARD (MARKET INTEL) --- */}
        {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-500 space-y-6">
                
                {/* Ticker de Preços */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cryptoData.map((coin) => (
                        <TechCard key={coin.id} className="group hover:border-accent-blue/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-wayne-dark border border-wayne-border rounded-sm">
                                        {coin.symbol === 'BTC' ? <Server size={20} className="text-accent-yellow"/> : 
                                         coin.symbol === 'ETH' ? <Cpu size={20} className="text-accent-blue"/> : 
                                         <Activity size={20} className="text-accent-green[#10b981]"/>}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white uppercase">{coin.name}</div>
                                        <div className="text-[10px] text-text-muted font-mono">{coin.symbol}/USD</div>
                                    </div>
                                </div>
                                <div className={`text-xs font-bold px-2 py-1 rounded-sm ${coin.change >= 0 ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                                    {coin.change > 0 ? '+' : ''}{coin.change}%
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white font-mono tracking-tight">$ {coin.price.toLocaleString()}</div>
                        </TechCard>
                    ))}
                </div>

                {/* Fear & Greed Index + Notícias */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TechCard title="Sentinela de Mercado" icon={AlertTriangle} status="LIVE FEED">
                        <div className="flex flex-col items-center justify-center h-full py-6">
                            <div className="relative w-full h-8 bg-wayne-dark[#0f1014] rounded-full border border-wayne-border overflow-hidden mb-4">
                                <div 
                                    className="h-full bg-linear-to-r from-accent-red via-accent-gold to-accent-green transition-all duration-1000"
                                    style={{ width: `${marketSentiment}%` }}
                                ></div>
                                <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] transition-all duration-1000" style={{ left: `${marketSentiment}%` }}></div>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-4xl font-black text-white mb-1">{marketSentiment}</div>
                                <div className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted">
                                    {marketSentiment < 30 ? 'MEDO EXTREMO (COMPRAR)' : 
                                     marketSentiment > 70 ? 'GANÂNCIA EXTREMA (VENDER)' : 'NEUTRO (HOLD)'}
                                </div>
                            </div>
                        </div>
                    </TechCard>

                    <TechCard title="Log de Segurança" icon={Terminal}>
                        <div className="space-y-3 font-mono text-xs h-50 overflow-hidden relative">
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-wayne-panel pointer-events-none"></div>
                            <div className="flex gap-3 text-text-muted border-b border-wayne-border pb-2 border-dashed">
                                <span className="w-16">10:42:01</span>
                                <span className="text-accent-blue">SYS_SCAN</span>
                                <span>Varredura de portas iniciada...</span>
                            </div>
                            <div className="flex gap-3 text-text-muted border-b border-wayne-border pb-2 border-dashed">
                                <span className="w-16">10:42:05</span>
                                <span className="text-accent-green">SECURE</span>
                                <span>Nenhuma anomalia detectada no Firewall.</span>
                            </div>
                            <div className="flex gap-3 text-text-muted border-b border-wayne-border pb-2 border-dashed">
                                <span className="w-16">10:43:12</span>
                                <span className="text-accent-red">ALERT</span>
                                <span>Tentativa de acesso IP 192.168.X.X bloqueada.</span>
                            </div>
                            <div className="flex gap-3 text-text-muted">
                                <span className="w-16">10:44:00</span>
                                <span className="text-accent-blue">MARKET</span>
                                <span>Volatilidade detectada no par BTC/USD.</span>
                            </div>
                        </div>
                    </TechCard>
                </div>
            </div>
        )}

        {/* --- VIEW: KEYGEN (PASSWORD GENERATOR) --- */}
        {activeTab === 'keygen' && (
            <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
                <TechCard title="Gerador de Entropia" icon={Key} subtitle="Criação de Chaves 256-bit">
                    
                    {/* Display da Senha */}
                    <div className="bg-wayne-dark border border-wayne-border p-6 rounded-sm mb-8 text-center relative group">
                        <div className="text-2xl md:text-3xl font-mono font-bold text-accent-blue tracking-wider break-all">
                            {password || 'AGUARDANDO GERAÇÃO...'}
                        </div>
                        {password && (
                            <button 
                                onClick={() => navigator.clipboard.writeText(password)}
                                className="absolute top-4 right-4 text-text-muted hover:text-white p-2 bg-wayne-dark rounded-sm border border-wayne-border"
                                title="Copiar para Área de Transferência"
                            >
                                <Copy size={16}/>
                            </button>
                        )}
                    </div>

                    {/* Controles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="text-xs font-bold text-text-muted uppercase mb-4 flex justify-between">
                                Comprimento da Chave <span className="text-white">{passLength} bits</span>
                            </label>
                            <input 
                                type="range" 
                                min="8" max="64" 
                                value={passLength} 
                                onChange={(e) => setPassLength(parseInt(e.target.value))}
                                className="w-full h-2 bg-wayne-dark rounded-lg appearance-none cursor-pointer border border-wayne-border accent-accent-blue"
                            />
                        </div>
                        <div className="flex items-center justify-between bg-wayne-dark p-4 rounded-sm border border-wayne-border">
                            <span className="text-sm font-bold text-white uppercase flex items-center gap-2">
                                <Hash size={16} className="text-accent-blue"/> Incluir Símbolos Especiais
                            </span>
                            <button 
                                onClick={() => setIncludeSymbols(!includeSymbols)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${includeSymbols ? 'bg-accent-blue' : 'bg-wayne-dark'}`}
                            >
                                <div className={`w-4 h-4 bg-black rounded-full transition-transform ${includeSymbols ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    <TacticalButton onClick={generatePassword} className="w-full py-4 text-sm">
                        <RefreshCw size={18} className={password ? '' : 'animate-spin'}/> 
                        Gerar Nova Chave de Segurança
                    </TacticalButton>
                </TechCard>
            </div>
        )}

        {/* --- VIEW: ENIGMA (ENCRYPTION) --- */}
        {activeTab === 'enigma' && (
            <div className="animate-in fade-in duration-500 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Input */}
                <TechCard title="Entrada de Dados" icon={Unlock}>
                    <textarea 
                        className="w-full h-64 bg-wayne-dark border border-wayne-border rounded-sm p-4 text-text-muted font-mono text-sm focus:border-accent-blue outline-none resize-none mb-4"
                        placeholder="Insira a mensagem ou hash aqui..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                    ></textarea>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsEncrypting(true)}
                            className={`flex-1 py-3 text-xs font-bold uppercase rounded-sm border transition-all ${isEncrypting ? 'bg-accent-blue text-black border-accent-blue' : 'bg-transparent text-text-muted border-wayne-border hover:text-white'}`}
                        >
                            <EyeOff size={16} className="inline mr-2"/> Encriptar
                        </button>
                        <button 
                            onClick={() => setIsEncrypting(false)}
                            className={`flex-1 py-3 text-xs font-bold uppercase rounded-sm border transition-all ${!isEncrypting ? 'bg-accent-blue text-black border-accent-blue' : 'bg-transparent text-text-muted border-wayne-border hover:text-white'}`}
                        >
                            <Eye size={16} className="inline mr-2"/> Decriptar
                        </button>
                    </div>
                </TechCard>

                {/* Output */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 flex flex-col justify-center">
                        <TacticalButton onClick={processEnigma} className="w-full py-4">
                            <Cpu size={20}/> Processar Algoritmo Enigma
                        </TacticalButton>
                    </div>
                    
                    <TechCard title="Saída Processada" icon={Lock} active>
                        <div className="h-64 bg-wayne-dark border border-wayne-border rounded-sm p-4 relative group overflow-hidden">
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button 
                                    onClick={() => navigator.clipboard.writeText(outputText)}
                                    className="p-2 bg-wayne-dark text-text-muted hover:text-white rounded-sm border border-wayne-border"
                                    title="Copiar"
                                >
                                    <Copy size={14}/>
                                </button>
                            </div>
                            <div className="font-mono text-sm text-accent-blue break-all">
                                {outputText || '// AGUARDANDO PROCESSAMENTO...'}
                            </div>
                        </div>
                    </TechCard>
                </div>

            </div>
        )}

      </div>
    </div>
  );
}