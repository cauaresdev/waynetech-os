import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

export default function ChecklistTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  
  const BASE_URL = 'https://arkham-backend.onrender.com'; // <--- CONFIRA SUA URL

  useEffect(() => {
    fetch(`${BASE_URL}/checklist`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.json()).then(data => setItems(data)).catch(err => console.error(err));
  }, [token]);

  const addItem = async () => {
    if (!newTask) return;
    const res = await fetch(`${BASE_URL}/checklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ task: newTask })
    });
    if (res.ok) {
      const saved = await res.json();
      setItems([saved, ...items]);
      setNewTask('');
    }
  };

  const toggleItem = async (id: number) => {
    setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
    await fetch(`${BASE_URL}/checklist/${id}/toggle`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
  };

  // 👇 FUNÇÃO DELETAR
  const deleteItem = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(items.filter(i => i.id !== id));
    await fetch(`${BASE_URL}/checklist/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold flex items-center gap-2"><CheckSquare className="text-accent-blue" /> CHECKLIST TÁTICO</h2>
      <div className="flex gap-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
        <input type="text" placeholder="Nova tarefa..." className="flex-1 bg-transparent outline-none text-white"
          value={newTask} onChange={e => setNewTask(e.target.value)} />
        <button onClick={addItem} className="bg-accent-blue text-black p-2 rounded"><Plus size={20}/></button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} onClick={() => toggleItem(item.id)} className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between gap-4 ${item.completed ? 'opacity-50 line-through bg-gray-900' : 'bg-gray-800'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded border ${item.completed ? 'bg-accent-blue' : 'border-gray-500'}`} />
                <span className="text-white">{item.task}</span>
            </div>
            {/* 👇 BOTÃO DE DELETAR */}
            <button onClick={(e) => deleteItem(item.id, e)} className="text-gray-600 hover:text-red-500 p-2"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}