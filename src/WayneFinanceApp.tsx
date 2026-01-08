import { useState, useEffect } from 'react';
import { 
  TrendingUp, CreditCard, ArrowUpRight, 
  ArrowDownRight, Plus, X, Shield, DollarSign, Calculator, PieChart as PieIcon,
  Globe, Activity, Coffee, Car, Smartphone, Dumbbell, Gamepad2, Calendar, Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- TIPOS ---
type CategoryType = 'food' | 'transport' | 'tech' | 'health' | 'fun' | 'other';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: CategoryType;
  date: string;
}

interface FinancialGoal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

interface Subscription {
    id: number;
    name: string;
    amount: number;
    day: number;
}

// --- CONFIGURAÇÃO VISUAL (TACTICAL BLUE) ---
const THEME = {
    bg_main: "bg-[#0f1014]",
    panel_bg: "bg-[#1a1c23]", 
    panel_border: "border-[#2c2f3a]", 
    accent: "text-[#38bdf8]", 
    btn_primary: "bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]"
};

const COLORS = ['#38bdf8', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

// --- COMPONENTES VISUAIS ---
const TechCard = ({ children, className = "", title, icon: Icon, active = false }: any) => (
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
        </div>
      )}
      {children}
    </div>
  </div>
);

const TacticalButton = ({ children, onClick, variant = 'primary', className = "" }: any) => (
    <button onClick={onClick} className={`px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-2 font-hud ${variant === 'primary' ? THEME.btn_primary : 'bg-transparent border border-wayne-border[#2c2f3a] hover:border-accent-blue[#38bdf8] text-text-muted[#94a3b8] hover:text-white'} ${className}`}>
        {children}
    </button>
);

const MarketTickerItem = ({ label, value, prefix = "R$" }: any) => (
    <div className="flex items-center gap-2 bg-wayne-dark border border-wayne-border[#2c2f3a] px-3 py-1.5 rounded-sm">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
        <span className="text-xs font-mono font-bold text-accent-blue flex items-center gap-1">
            {value ? `${prefix} ${value.toLocaleString()}` : <Activity size={10} className="animate-spin"/>}
        </span>
    </div>
);

const CategoryIcon = ({ cat }: { cat: CategoryType }) => {
    const icons = {
        food: <Coffee size={16}/>,
        transport: <Car size={16}/>,
        tech: <Smartphone size={16}/>,
        health: <Dumbbell size={16}/>,
        fun: <Gamepad2 size={16}/>,
        other: <DollarSign size={16}/>
    };
    return icons[cat] || icons.other;
};

export default function WayneFinanceApp() {
  const [loading, setLoading] = useState(true);
  
  // STATES
  const [marketData, setMarketData] = useState({ usd: 0, btc: 0, eth: 0 });
  const [balance, setBalance] = useState(0);
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
      const s = localStorage.getItem('wayne_finance_tx');
      return s ? JSON.parse(s) : [
          {id: 1, description: 'Reserva Estratégica', amount: 4500, type: 'income', category: 'other', date: '01/01'},
          {id: 2, description: 'Equipamento Tático', amount: 120, type: 'expense', category: 'health', date: '02/01'}
      ];
  });
  
  const [goals] = useState<FinancialGoal[]>(() => {
      const s = localStorage.getItem('wayne_finance_goals');
      return s ? JSON.parse(s) : [{id: 1, title: 'Batcomputer Upgrade', targetAmount: 10000, currentAmount: 3500}];
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
      const s = localStorage.getItem('wayne_finance_subs');
      return s ? JSON.parse(s) : [{id: 1, name: 'Cloud Server', amount: 45.90, day: 10}, {id: 2, name: 'Gym Pass', amount: 120.00, day: 5}];
  });

  // Inputs
  const [newTxDesc, setNewTxDesc] = useState('');
  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxType, setNewTxType] = useState<'income' | 'expense'>('expense');
  const [newTxCategory, setNewTxCategory] = useState<CategoryType>('food');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inputs Assinatura
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');
  const [newSubDay, setNewSubDay] = useState('');

  // Calc Inputs
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcPrincipal, setCalcPrincipal] = useState(1000);
  const [calcMonthly, setCalcMonthly] = useState(200);
  const [calcRate, setCalcRate] = useState(10);
  const [calcYears, setCalcYears] = useState(10);
  const [calcResult, setCalcResult] = useState(0);

  // --- EFEITOS ---
  useEffect(() => {
      const fetchMarket = async () => {
          try {
              const fiatRes = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
              const fiatJson = await fiatRes.json();
              const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
              const cryptoJson = await cryptoRes.json();
              setMarketData({ usd: parseFloat(fiatJson.USDBRL.bid), btc: cryptoJson.bitcoin.usd, eth: cryptoJson.ethereum.usd });
          } catch (error) { console.log("Erro API Mercado"); }
      };
      fetchMarket();
      const interval = setInterval(fetchMarket, 60000);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      const total = transactions.reduce((acc, item) => item.type === 'income' ? acc + item.amount : acc - item.amount, 0);
      setBalance(total);
      localStorage.setItem('wayne_finance_tx', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => { localStorage.setItem('wayne_finance_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('wayne_finance_subs', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { setTimeout(() => setLoading(false), 1000); }, []);

  // Funções
  const calculateCompoundInterest = () => {
      const r = calcRate / 100 / 12; 
      const n = calcYears * 12; 
      const futureValue = calcPrincipal * Math.pow(1 + r, n) + (calcMonthly * (Math.pow(1 + r, n) - 1)) / r;
      setCalcResult(futureValue);
  };

  const addTransaction = () => {
      if(!newTxDesc || !newTxAmount) return;
      const newTx: Transaction = {
          id: Date.now(),
          description: newTxDesc,
          amount: parseFloat(newTxAmount),
          type: newTxType,
          category: newTxCategory,
          date: new Date().toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})
      };
      setTransactions([newTx, ...transactions]);
      setNewTxDesc(''); setNewTxAmount(''); setIsModalOpen(false);
  };

  const removeTransaction = (id: number) => setTransactions(transactions.filter(t => t.id !== id));
  
  const addSubscription = () => {
      if(!newSubName || !newSubAmount) return;
      const newSub: Subscription = {
          id: Date.now(),
          name: newSubName,
          amount: parseFloat(newSubAmount),
          day: parseInt(newSubDay) || 1
      };
      setSubscriptions([...subscriptions, newSub]);
      setNewSubName(''); setNewSubAmount(''); setNewSubDay(''); setIsSubModalOpen(false);
  };

  const removeSubscription = (id: number) => setSubscriptions(subscriptions.filter(s => s.id !== id));

  const formatMoney = (val: number) => `R$ ${val.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const fixedCosts = subscriptions.reduce((acc, sub) => acc + sub.amount, 0);
  
  const chartData = [{ name: 'Entradas', value: income }, { name: 'Saídas', value: expense }].filter(d => d.value > 0);

  if (loading) {
    return (
        <div className="min-h-screen bg-wayne-dark[#0f1014] flex items-center justify-center flex-col gap-6 font-hud">
           <div className="relative w-20 h-20 bg-wayne-dark[#38bdf8]/10 rounded-sm border border-accent-blue/50 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.2)]">
               <Shield size={32} className="text-accent-blue animate-pulse" />
           </div>
           <div className="text-xl font-bold text-white tracking-[0.3em] font-hud">WAYNE <span className="text-accent-blue">FINANCE</span></div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-wayne-dark text-text-primary font-hud selection:bg-accent-blue selection:text-black pb-20 overflow-x-hidden">
      
      {/* Background Tático */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="fixed top-0 right-0 w-[125] h-[125] bg-accent-blue/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        
        {/* TICKER */}
        <div className="flex flex-wrap gap-2 mb-8 items-center border-b border-wayne-border pb-6">
            <div className="flex items-center gap-2 mr-4">
                <Globe size={16} className="text-accent-blue animate-pulse"/>
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Live Market</span>
            </div>
            <MarketTickerItem label="USD/BRL" value={marketData.usd} prefix="R$" />
            <MarketTickerItem label="BTC/USD" value={marketData.btc} prefix="$" />
        </div>

        <header className="mb-10 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 uppercase">
                    <Shield className="text-accent-blue" /> Financeiro
                </h1>
                <p className="text-xs text-text-muted font-bold uppercase tracking-[0.2em] mt-1">Divisão de Recursos Wayne</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => {setIsCalcOpen(true); calculateCompoundInterest();}} className="bg-wayne-border hover:bg-wayne-border text-accent-blue border border-wayne-border p-3 rounded-sm transition-all" title="Simulador">
                    <Calculator size={20}/>
                </button>
                <button onClick={() => setIsModalOpen(true)} className="bg-accent-blue hover:bg-accent-blue[#0ea5e9] text-black p-3 rounded-sm transition-all hover:scale-105" title="Nova Transação">
                    <Plus size={20}/>
                </button>
            </div>
        </header>

        {/* DASHBOARD PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <TechCard title="Saldo Operacional" icon={DollarSign} active>
                <div className="mt-2">
                    <div className="text-4xl font-bold text-white tracking-tight font-mono">{formatMoney(balance)}</div>
                    <div className="text-xs text-accent-blue font-bold uppercase mt-2 flex items-center gap-1">
                        <TrendingUp size={14}/> +12% rendimento
                    </div>
                </div>
            </TechCard>
            <TechCard title="Custo Fixo (Assinaturas)" icon={Calendar}>
                <div className="text-2xl font-bold text-text-muted font-mono">{formatMoney(fixedCosts)}</div>
                <div className="text-[10px] text-text-muted mt-1 uppercase">Débito Automático</div>
            </TechCard>
            <TechCard title="Saídas Variáveis" icon={ArrowDownRight}>
                <div className="text-2xl font-bold text-text-red font-mono">{formatMoney(expense)}</div>
            </TechCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LISTA DE TRANSAÇÕES */}
            <div className="lg:col-span-2">
                <TechCard title="Fluxo de Caixa" icon={CreditCard}>
                    <div className="space-y-3 max-h-100 overflow-y-auto pr-2 custom-finance-scroll">
                        {transactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center p-4 rounded-sm bg-wayne-dark[#0f1014] border border-wayne-border hover:border-accent-blue/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-sm border ${t.type === 'income' ? 'bg-accent-green/10 text-accent-green border-accent-green/30' : 'bg-accent-red/10 text-accent-red border-accent-red/30'}`}>
                                        {t.type === 'income' ? <ArrowUpRight size={18}/> : <CategoryIcon cat={t.category}/>}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white uppercase">{t.description}</div>
                                        <div className="text-[10px] text-text-muted uppercase font-bold">{t.category} • {t.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`font-mono font-bold ${t.type === 'income' ? 'text-accent-green' : 'text-accent-red'}`}>
                                        {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                                    </span>
                                    <button onClick={() => removeTransaction(t.id)} className="text-text-muted hover:text-accent-red opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TechCard>
            </div>

            {/* BARRA LATERAL */}
            <div className="space-y-8">
                
                {/* ASSINATURAS */}
                <TechCard title="Assinaturas Recorrentes" icon={Calendar}>
                    <div className="space-y-3">
                        {subscriptions.map(sub => (
                            <div key={sub.id} className="flex justify-between items-center text-xs p-3 bg-wayne-dark[#0f1014] rounded-sm border border-wayne-border group hover:border-accent-blue/50 transition-all">
                                <span className="font-bold text-white uppercase">{sub.name}</span>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-accent-blue font-mono font-bold">{formatMoney(sub.amount)}</div>
                                        <div className="text-[9px] text-text-muted">DIA {sub.day}</div>
                                    </div>
                                    <button onClick={() => removeSubscription(sub.id)} className="text-text-muted hover:text-accent-red opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => setIsSubModalOpen(true)} className="w-full text-center text-[10px] text-text-muted hover:text-white uppercase font-bold mt-2 border border-dashed border-wayne-border p-3 rounded-sm hover:border-accent-blue transition-all">+ Novo Contrato</button>
                    </div>
                </TechCard>

                <TechCard title="Distribuição de Gastos" icon={PieIcon}>
                    <div className="h-37.5 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                    {chartData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#0f1014', border: '1px solid #2c2f3a', fontFamily: 'Titillium Web'}} itemStyle={{color: '#fff'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </TechCard>
            </div>

        </div>

        {/* MODAL NOVA TRANSAÇÃO */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-hud">
                <div className="bg-wayne-dark border border-accent-blue rounded-sm w-full max-w-md p-6 shadow-[0_0_50px_rgba(56,189,248,0.2)]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase"><Plus size={20} className="text-accent-blue"/> Nova Movimentação</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Descrição</label>
                            <input type="text" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" placeholder="Identificação..." value={newTxDesc} onChange={e => setNewTxDesc(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Valor</label>
                                <input type="number" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" placeholder="0.00" value={newTxAmount} onChange={e => setNewTxAmount(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Tipo</label>
                                <select className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" value={newTxType} onChange={(e:any) => setNewTxType(e.target.value)}>
                                    <option value="expense">Saída (-)</option>
                                    <option value="income">Entrada (+)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Categoria</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    {id: 'food', label: 'Comida', icon: Coffee},
                                    {id: 'transport', label: 'Transp.', icon: Car},
                                    {id: 'tech', label: 'Tech', icon: Smartphone},
                                    {id: 'health', label: 'Saúde', icon: Dumbbell},
                                    {id: 'fun', label: 'Lazer', icon: Gamepad2},
                                    {id: 'other', label: 'Outro', icon: DollarSign},
                                ].map(cat => (
                                    <button 
                                        key={cat.id} 
                                        onClick={() => setNewTxCategory(cat.id as CategoryType)}
                                        className={`flex flex-col items-center justify-center p-2 rounded-sm border transition-all ${newTxCategory === cat.id ? 'bg-accent-blue text-black border-accent-blue' : 'bg-wayne-dark border-wayne-border text-text-muted hover:border-accent-blue hover:text-white'}`}
                                    >
                                        <cat.icon size={16} className="mb-1"/>
                                        <span className="text-[9px] font-bold uppercase">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <TacticalButton onClick={addTransaction} className="flex-1">Confirmar</TacticalButton>
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-3 rounded-sm text-xs font-bold uppercase text-text-muted hover:text-white transition-colors border border-wayne-border">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL NOVA ASSINATURA */}
        {isSubModalOpen && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-hud">
                <div className="bg-wayne-dark border border-accent-blue rounded-sm w-full max-w-sm p-6 shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase"><Calendar size={20} className="text-accent-blue"/> Nova Assinatura</h3>
                    <div className="space-y-4">
                        <input type="text" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" placeholder="Nome (Ex: Netflix)" value={newSubName} onChange={e => setNewSubName(e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" placeholder="Valor (R$)" value={newSubAmount} onChange={e => setNewSubAmount(e.target.value)} />
                            <input type="number" className="w-full bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" placeholder="Dia Venc." value={newSubDay} onChange={e => setNewSubDay(e.target.value)} />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <TacticalButton onClick={addSubscription} className="flex-1">Salvar</TacticalButton>
                            <button onClick={() => setIsSubModalOpen(false)} className="px-4 py-3 rounded-sm text-xs font-bold uppercase text-text-muted hover:text-white transition-colors border border-wayne-border">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL JUROS */}
        {isCalcOpen && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-hud">
                <div className="bg-wayne-dark border border-accent-blue rounded-sm w-full max-w-md p-6 shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase"><Calculator size={20} className="text-accent-blue"/> Simulação de Rendimento</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" className="bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" placeholder="Inicial" value={calcPrincipal} onChange={e => setCalcPrincipal(Number(e.target.value))} />
                            <input type="number" className="bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" placeholder="Mensal" value={calcMonthly} onChange={e => setCalcMonthly(Number(e.target.value))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" className="bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" placeholder="Taxa %" value={calcRate} onChange={e => setCalcRate(Number(e.target.value))} />
                            <input type="number" className="bg-wayne-dark border border-wayne-border rounded-sm p-3 text-white outline-none focus:border-accent-blue" placeholder="Anos" value={calcYears} onChange={e => setCalcYears(Number(e.target.value))} />
                        </div>
                        <div className="bg-accent-blue/10 p-4 rounded-sm text-center border border-accent-blue/30 mt-4">
                            <div className="text-3xl font-bold text-white font-mono">{formatMoney(calcResult)}</div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <TacticalButton onClick={calculateCompoundInterest} className="flex-1">Calcular</TacticalButton>
                            <button onClick={() => setIsCalcOpen(false)} className="text-text-muted px-4 uppercase text-xs font-bold hover:text-white">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
      <style>{`
        .custom-finance-scroll::-webkit-scrollbar { width: 4px; }
        .custom-finance-scroll::-webkit-scrollbar-track { background: #0f1014; }
        .custom-finance-scroll::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 4px; }
      `}</style>
    </div>
  );
}