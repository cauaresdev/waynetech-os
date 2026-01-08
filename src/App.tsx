import { useState } from 'react';
import { Shield, Brain, CreditCard, Activity, Archive, Grid, Cpu } from 'lucide-react';
import BatmanWorkoutDashboard from './BatmanWorkoutDashboard';
import WayneFinanceApp from './WayneFinanceApp';
import OracleApp from './OracleApp';
import CryptosApp from './CryptosApp';
import ArkhamArchivesApp from './ArkhamArchivesApp';

export default function App() {
  const [currentModule, setCurrentModule] = useState('menu');

  const renderModule = () => {
    switch(currentModule) {
      case 'bat-os': return <BatmanWorkoutDashboard />;
      case 'finance': return <WayneFinanceApp />;
      case 'oracle': return <OracleApp />;
      case 'cryptos': return <CryptosApp />;
      case 'arkham': return <ArkhamArchivesApp />;
      default: return <MainMenu onSelect={setCurrentModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-wayne-dark text-text-main font-hud selection:bg-accent-blue selection:text-black overflow-x-hidden">
      {/* Background Tático */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {currentModule !== 'menu' && (
        <div className="fixed top-6 left-6 z-50 animate-in fade-in duration-300">
          <button onClick={() => setCurrentModule('menu')} className="bg-wayne-panel/90 backdrop-blur-md border border-accent-blue/30 p-3 rounded-sm text-accent-blue hover:bg-accent-blue hover:text-black transition-all shadow-lg group">
            <Grid size={24} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      )}
      <div className="relative z-10">{renderModule()}</div>
    </div>
  );
}

const MainMenu = ({ onSelect }: any) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="relative z-10 w-full max-w-6xl">
        <header className="mb-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-accent-blue/10 border border-accent-blue/30 mb-6 rounded-sm">
            <Cpu size={14} className="text-accent-blue animate-pulse"/>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-blue">WayneTech OS v10.5</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight uppercase mb-4">
            Painel de <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-blue to-blue-600">Controle</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base font-mono tracking-widest max-w-xl mx-auto uppercase">Selecione o subsistema para inicialização imediata.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuCard title="BAT-OS" subtitle="Condicionamento Físico" code="SYS_PHY" icon={Activity} onClick={() => onSelect('bat-os')} />
          <MenuCard title="FINANCE" subtitle="Gestão de Recursos" code="SYS_RES" icon={CreditCard} onClick={() => onSelect('finance')} />
          <MenuCard title="ORACLE" subtitle="Inteligência & Dados" code="SYS_INT" icon={Brain} onClick={() => onSelect('oracle')} />
          <MenuCard title="CRYPTOS" subtitle="Segurança Digital" code="SYS_SEC" icon={Shield} onClick={() => onSelect('cryptos')} />
          <MenuCard title="ARKHAM" subtitle="Arquivos de Código" code="SYS_DEV" icon={Archive} onClick={() => onSelect('arkham')} className="md:col-span-2 lg:col-span-2" />
        </div>
      </div>
      <footer className="absolute bottom-6 text-[10px] text-wayne-border uppercase tracking-[0.5em] font-bold">Wayne Enterprise Proprietary Software</footer>
    </div>
  );
};

const MenuCard = ({ title, subtitle, code, icon: Icon, onClick, className = "" }: any) => (
  <button onClick={onClick} className={`relative group bg-wayne-panel border border-wayne-border p-8 rounded-sm text-left transition-all duration-300 hover:border-accent-blue hover:bg-wayne-panel/80 hover:shadow-lg ${className}`}>
    <div className="absolute top-0 right-0 w-0 h-0 border-t-20px border-r-20px border-t-transparent border-r-wayne-border group-hover:border-r-accent-blue transition-colors"></div>
    <div className="flex justify-between items-start mb-6">
        <div className="p-3 rounded-sm bg-wayne-dark border border-wayne-border text-text-muted group-hover:text-accent-blue group-hover:border-accent-blue transition-colors">
            <Icon size={28} />
        </div>
        <span className="text-[10px] font-mono text-wayne-border group-hover:text-accent-blue transition-colors">{code}</span>
    </div>
    <h3 className="text-2xl font-bold text-white mb-1 tracking-wide group-hover:translate-x-1 transition-transform">{title}</h3>
    <p className="text-text-muted text-xs font-bold uppercase tracking-wider group-hover:text-text-main transition-colors">{subtitle}</p>
  </button>
);