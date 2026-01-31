import { useState, useEffect } from 'react';
import { CheckCircle, Plus, Shield } from 'lucide-react';

// 👇👇👇 COLOQUE SUA URL DO RENDER AQUI EMBAIXO 👇👇👇
const API_URL = 'https://arkham-backend.onrender.com'; 

interface Mission {
  id: number;
  title: string;
  xp: number;
  completed: boolean;
}

export default function MissionsTab({ token }: { token: string }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [newMission, setNewMission] = useState('');
  const [newXP, setNewXP] = useState('10');

  // Carregar missões ao abrir
  useEffect(() => {
    fetch(`${API_URL}/missions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMissions(data))
      .catch(err => console.error("Erro ao carregar missões:", err));
  }, [token]);

  // Criar nova missão
  const addMission = async () => {
    if (!newMission) return;
    
    const res = await fetch(`${API_URL}/missions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ title: newMission, xp: newXP })
    });

    if (res.ok) {
      const savedMission = await res.json();
      setMissions([...missions, savedMission]);
      setNewMission('');
    }
  };

  // Completar missão
  const toggleMission = async (id: number) => {
    // Atualiza visualmente na hora (otimista)
    setMissions(missions.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));

    // Atualiza no banco
    await fetch(`${API_URL}/missions/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-yellow-500" />
          MISSÕES ATIVAS
        </h2>
        <span className="text-sm text-gray-400">XP TOTAL: {missions.filter(m => m.completed).reduce((acc, curr) => acc + curr.xp, 0)}</span>
      </div>

      {/* Área de Adicionar */}
      <div className="flex gap-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
        <input 
          type="text" 
          placeholder="Nova missão..." 
          className="flex-1 bg-transparent outline-none text-white"
          value={newMission}
          onChange={e => setNewMission(e.target.value)}
        />
        <select 
          value={newXP} 
          onChange={e => setNewXP(e.target.value)}
          className="bg-gray-800 text-white rounded px-2"
        >
          <option value="10">10 XP</option>
          <option value="50">50 XP</option>
          <option value="100">100 XP</option>
        </select>
        <button onClick={addMission} className="bg-yellow-600 p-2 rounded hover:bg-yellow-500">
          <Plus size={20} />
        </button>
      </div>

      {/* Lista de Missões */}
      <div className="space-y-3">
        {missions.map(mission => (
          <div 
            key={mission.id} 
            onClick={() => toggleMission(mission.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between group
              ${mission.completed ? 'bg-green-900/20 border-green-800 opacity-60' : 'bg-gray-800 border-gray-700 hover:border-yellow-500'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${mission.completed ? 'border-green-500 bg-green-500' : 'border-gray-500'}`}>
                {mission.completed && <CheckCircle size={14} className="text-black" />}
              </div>
              <span className={mission.completed ? 'line-through text-gray-500' : 'text-white'}>
                {mission.title}
              </span>
            </div>
            <span className="text-xs font-mono text-yellow-500">+{mission.xp} XP</span>
          </div>
        ))}
        {missions.length === 0 && (
          <p className="text-center text-gray-600 py-10">Nenhuma missão ativa. O crime descansa... por enquanto.</p>
        )}
      </div>
    </div>
  );
}