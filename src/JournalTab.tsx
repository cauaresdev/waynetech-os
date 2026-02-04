import { useState, useEffect } from 'react';
import { Trash2, Calendar, Clock, FileText } from 'lucide-react';

export default function JournalTab({ token }: { token: string }) {
  const [journals, setJournals] = useState<any[]>([]);
  const [content, setContent] = useState('');
  
  const BASE_URL = 'https://arkham-backend.onrender.com';

  useEffect(() => { fetchJournals(); }, [token]);

  const fetchJournals = async () => {
    try {
        const res = await fetch(`${BASE_URL}/journal`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setJournals(await res.json());
    } catch (e) { console.error(e); }
  };

  const saveEntry = async () => {
      await fetch(`${BASE_URL}/journal`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ content })
      });
      setContent('');
      fetchJournals();
  };

  const deleteEntry = async (id: number) => {
      await fetch(`${BASE_URL}/journal/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchJournals();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* ÁREA DE INPUT (SIMPLES) */}
      <div className="wayne-panel p-4">
           <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
             <FileText size={14} /> Novo Registro
           </h2>
           <textarea
             className="w-full h-32 bg-black/50 border border-gray-700 p-2 text-gray-300 text-sm outline-none"
             placeholder="Digite aqui..."
             value={content}
             onChange={(e) => setContent(e.target.value)}
           />
           <button onClick={saveEntry} className="mt-2 bg-blue-900/20 hover:bg-blue-600 text-blue-400 text-xs font-bold py-2 px-4 uppercase transition-all">
               SALVAR
           </button>
      </div>

      {/* ÁREA DE LISTA (O PROBLEMA: ELA ERA APENAS UMA LISTA CORRIDA, SEM SCROLL FIXO) */}
      <div className="space-y-4">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} /> Histórico
          </h2>
          
          {journals.map((journal) => (
              <div key={journal.id} className="wayne-panel p-4">
                  <div className="flex justify-between items-center mb-2">
                      <div className="text-blue-500 font-mono text-xs flex gap-2 items-center">
                        <Clock size={12}/> {new Date(journal.createdAt).toLocaleDateString()}
                      </div>
                      <button onClick={() => deleteEntry(journal.id)}><Trash2 size={12} className="text-gray-600 hover:text-red-500"/></button>
                  </div>
                  <p className="text-sm text-gray-300">{journal.content}</p>
              </div>
          ))}
      </div>
    </div>
  );
}