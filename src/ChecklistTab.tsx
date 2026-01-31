import { useState, useEffect } from 'react';
import { CheckSquare, Plus } from 'lucide-react';

const API_URL = 'https://arkham-backend.onrender.com'; // <--- SUA URL AQUI

interface ChecklistItem {
  id: number;
  task: string;
  completed: boolean;
}

export default function ChecklistTab({ token }: { token: string }) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/checklist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setItems(data))
    .catch(err => console.error("Erro checklist:", err));
  }, [token]);

  const addItem = async () => {
    if (!newTask) return;
    const res = await fetch(`${API_URL}/checklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ task: newTask })
    });
    if (res.ok) {
      const saved = await res.json();
      setItems([...items, saved]);
      setNewTask('');
    }
  };

  const toggleItem = async (id: number) => {
    setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
    await fetch(`${API_URL}/checklist/${id}/toggle`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <CheckSquare className="text-accent-blue" /> CHECKLIST TÁTICO
      </h2>
      <div className="flex gap-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
        <input 
          type="text" 
          placeholder="Nova tarefa..." 
          className="flex-1 bg-transparent outline-none text-white"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <button onClick={addItem} className="bg-accent-blue text-black p-2 rounded"><Plus size={20}/></button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} onClick={() => toggleItem(item.id)} className={`p-4 rounded-lg border cursor-pointer flex items-center gap-4 ${item.completed ? 'opacity-50 line-through' : 'bg-gray-800'}`}>
            <div className={`w-5 h-5 rounded border ${item.completed ? 'bg-accent-blue' : 'border-gray-500'}`} />
            <span className="text-white">{item.task}</span>
          </div>
        ))}
      </div>
    </div>
  );
}