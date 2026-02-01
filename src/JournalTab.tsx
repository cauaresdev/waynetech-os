import { useState, useEffect } from 'react';
import { Book, Save, Trash2 } from 'lucide-react';

export default function JournalTab({ token }: { token: string }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Focado');
  
  const BASE_URL = 'https://arkham-backend.onrender.com'; // <--- CONFIRA SUA URL

  useEffect(() => {
    fetch(`${BASE_URL}/journal`, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.json()).then(data => setEntries(data)).catch(err => console.error(err));
  }, [token]);

  const saveEntry = async () => {
    if (!content) return;
    const res = await fetch(`${BASE_URL}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ content, mood })
    });
    if (res.ok) {
      const saved = await res.json();
      setEntries([saved, ...entries]);
      setContent('');
    }
  };

  // 👇 FUNÇÃO DELETAR
  const deleteEntry = async (id: number) => {
      if(!confirm("Apagar este registro?")) return;
      setEntries(entries.filter(e => e.id !== id));
      await fetch(`${BASE_URL}/journal/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><Book className="text-accent-blue"/> DIÁRIO</h2>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-4">
          <select value={mood} onChange={e => setMood(e.target.value)} className="w-full bg-black text-white p-2 border border-gray-700">
            <option>Focado</option><option>Cansado</option><option>Motivado</option>
          </select>
          <textarea className="w-full h-32 bg-black text-white p-2 border border-gray-700" value={content} onChange={e => setContent(e.target.value)} placeholder="Relatório do dia..." />
          <button onClick={saveEntry} className="w-full bg-accent-blue text-black font-bold py-2 rounded flex items-center justify-center gap-2"><Save size={16}/> SALVAR</button>
        </div>
      </div>
      <div className="space-y-3 max-h-[100] overflow-y-auto pr-2">
        {entries.map(entry => (
          <div key={entry.id} className="bg-gray-800 p-3 rounded border-l-2 border-accent-blue relative group">
            <div className="flex justify-between items-start mb-2">
                <div className="text-xs text-accent-blue">{new Date(entry.date).toLocaleDateString()} - {entry.mood}</div>
                {/* 👇 BOTÃO DE DELETAR */}
                <button onClick={() => deleteEntry(entry.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
            </div>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}