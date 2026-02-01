import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Briefcase, Coffee, Dumbbell, Moon } from 'lucide-react';

export default function RoutineTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ timeStart: '', timeEnd: '', activity: '', category: 'work' });
  
  // 👇👇👇 CONFIRA SEU LINK AQUI 👇👇👇
  const BASE_URL = 'https://arkham-backend.onrender.com'; 

  useEffect(() => {
    fetch(`${BASE_URL}/routine`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => setItems(data))
    .catch(err => console.error(err));
  }, [token]);

  const addItem = async () => {
    if (!form.activity || !form.timeStart) return;
    
    const res = await fetch(`${BASE_URL}/routine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      const saved = await res.json();
      // Adiciona e reordena a lista visualmente
      const newList = [...items, saved].sort((a, b) => a.timeStart.localeCompare(b.timeStart));
      setItems(newList);
      setForm({ timeStart: '', timeEnd: '', activity: '', category: 'work' }); // Limpa form
    }
  };

  const deleteItem = async (id: number) => {
    if(!confirm("Remover este horário?")) return;
    setItems(items.filter(i => i.id !== id));
    await fetch(`${BASE_URL}/routine/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
  };

  // Helper para ícones
  const getIcon = (cat: string) => {
      switch(cat) {
          case 'training': return <Dumbbell size={16} className="text-accent-blue"/>;
          case 'rest': return <Moon size={16} className="text-purple-400"/>;
          case 'sustenance': return <Coffee size={16} className="text-orange-400"/>;
          default: return <Briefcase size={16} className="text-gray-400"/>;
      }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          <Clock className="w-6 h-6 text-accent-blue" /> AGENDA OPERACIONAL
        </h2>
      </div>

      {/* FORMULÁRIO DE ADIÇÃO */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
        <input type="time" className="bg-black text-white p-2 rounded border border-gray-700" 
          value={form.timeStart} onChange={e => setForm({...form, timeStart: e.target.value})} />
        <input type="time" className="bg-black text-white p-2 rounded border border-gray-700" 
          value={form.timeEnd} onChange={e => setForm({...form, timeEnd: e.target.value})} />
        
        <input type="text" placeholder="Atividade..." className="md:col-span-2 bg-black text-white p-2 rounded border border-gray-700"
          value={form.activity} onChange={e => setForm({...form, activity: e.target.value})} />
        
        <div className="flex gap-1">
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} 
                className="bg-black text-white p-2 rounded border border-gray-700 flex-1">
                <option value="work">Trabalho</option>
                <option value="training">Treino</option>
                <option value="sustenance">Nutrição</option>
                <option value="rest">Descanso</option>
            </select>
            <button onClick={addItem} className="bg-accent-blue text-black p-2 rounded hover:bg-blue-400"><Plus size={20}/></button>
        </div>
      </div>

      {/* LISTA DE HORÁRIOS */}
      <div className="space-y-1 relative">
        {/* Linha do tempo decorativa */}
        <div className="absolute left-[18] top-0 bottom-0 w-0.5 bg-gray-800/50 z-0"></div>

        {items.map(item => (
          <div key={item.id} className="relative z-10 flex items-center gap-4 group">
            {/* Horário */}
            <div className="w-16 text-right text-xs font-mono text-gray-500 pt-1">
                {item.timeStart}
            </div>
            
            {/* Card */}
            <div className="flex-1 p-3 rounded bg-gray-800/50 border border-gray-700/50 flex justify-between items-center hover:border-accent-blue/30 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-black/50 border border-gray-700">
                        {getIcon(item.category)}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">{item.activity}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{item.category} • até {item.timeEnd}</div>
                    </div>
                </div>
                <button onClick={() => deleteItem(item.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                    <Trash2 size={16} />
                </button>
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
            <div className="text-center text-gray-600 py-10 text-xs uppercase tracking-widest">Nenhuma operação agendada</div>
        )}
      </div>
    </div>
  );
}