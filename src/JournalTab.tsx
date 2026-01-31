import { useState, useEffect } from 'react';
import { Book, Save } from 'lucide-react';

// 👇👇👇 SUA URL DO RENDER AQUI 👇👇👇
const API_URL = 'https://arkham-backend.onrender.com';

interface Entry {
  id: number;
  date: string;
  content: string;
  mood: string;
}

export default function JournalTab({ token }: { token: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Focado');

  useEffect(() => {
    fetch(`${API_URL}/journal`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setEntries(data))
    .catch(err => console.error("Erro journal:", err));
  }, [token]);

  const saveEntry = async () => {
    if (!content) return;
    const res = await fetch(`${API_URL}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ content, mood })
    });
    if (res.ok) {
      const saved = await res.json();
      setEntries([saved, ...entries]); // Adiciona no topo
      setContent('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      {/* Coluna da Esquerda: Escrever */}
      <div className="md:col-span-1 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Book className="text-accent-blue" /> DIÁRIO DE CAMPO
        </h2>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">Estado Mental</label>
            <select 
              value={mood} 
              onChange={e => setMood(e.target.value)}
              className="w-full bg-black border border-gray-700 text-white p-2 rounded mt-1"
            >
              <option>Focado</option>
              <option>Cansado</option>
              <option>Motivado</option>
              <option>Estressado</option>
              <option>Lesionado</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">Relatório</label>
            <textarea 
              className="w-full h-40 bg-black border border-gray-700 text-white p-3 rounded mt-1 outline-none focus:border-accent-blue"
              placeholder="Registre o progresso, dores ou pensamentos..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <button onClick={saveEntry} className="w-full bg-accent-blue text-black font-bold py-2 rounded hover:bg-blue-400 flex justify-center items-center gap-2">
            <Save size={16} /> GRAVAR LOG
          </button>
        </div>
      </div>

      {/* Coluna da Direita: Histórico */}
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-gray-400">HISTÓRICO DE LOGS</h3>
        <div className="space-y-3 max-h-[125] overflow-y-auto pr-2">
          {entries.map(entry => (
            <div key={entry.id} className="bg-gray-800/50 p-4 rounded border-l-2 border-accent-blue">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-accent-blue">{new Date(entry.date).toLocaleDateString()}</span>
                <span className="text-xs bg-black px-2 py-1 rounded text-gray-300 uppercase">{entry.mood}</span>
              </div>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{entry.content}</p>
            </div>
          ))}
          {entries.length === 0 && <p className="text-gray-600">Nenhum registro encontrado.</p>}
        </div>
      </div>
    </div>
  );
}