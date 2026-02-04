import { useState, useEffect } from 'react';
import { Save, Trash2, Calendar, Clock, FileText } from 'lucide-react';

export default function JournalTab({ token }: { token: string }) {
  const [journals, setJournals] = useState<any[]>([]);
  const [content, setContent] = useState('');
  
  const BASE_URL = 'https://arkham-api-cauarosa.onrender.com';

  useEffect(() => {
    fetchJournals();
  }, [token]);

  const fetchJournals = async () => {
    try {
      const res = await fetch(`${BASE_URL}/journal`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Ordena mais recente primeiro
        setJournals(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (error) {
      console.error("Erro ao buscar diários", error);
    }
  };

  const saveEntry = async () => {
    if (!content.trim()) return;
    try {
      await fetch(`${BASE_URL}/journal`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ content })
      });
      setContent('');
      fetchJournals();
    } catch (error) {
      alert("Erro ao salvar.");
    }
  };

  const deleteEntry = async (id: number) => {
    if (!confirm("Deletar este registro?")) return;
    try {
      await fetch(`${BASE_URL}/journal/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchJournals();
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  };

  // Função simples de data para evitar erros
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch (e) {
      return 'Data Inválida';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in h-full">
      
      {/* ESQUERDA: ÁREA DE INPUT (1/3 da tela) */}
      <div className="lg:col-span-1 space-y-4">
        <div className="wayne-panel p-4 border-l-4 border-l-blue-600 bg-black/40">
           <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
             <FileText size={14} /> Novo Log
           </h2>
           <textarea
             className="w-full h-64 bg-black/50 border border-gray-700 p-3 text-gray-300 text-sm focus:border-blue-500 outline-none resize-none font-sans"
             placeholder="Relatório da missão..."
             value={content}
             onChange={(e) => setContent(e.target.value)}
           />
           <div className="mt-2 flex justify-end">
             <button 
               onClick={saveEntry} 
               className="bg-blue-900/30 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-800 text-xs font-bold py-2 px-4 uppercase tracking-widest transition-all flex items-center gap-2"
             >
               <Save size={14} /> Salvar
             </button>
           </div>
        </div>
        
        {/* Card simples de contagem */}
        <div className="wayne-panel p-4 flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase">Arquivos</span>
            <span className="font-bold text-white font-mono">{journals.length}</span>
        </div>
      </div>

      {/* DIREITA: LISTA DE LOGS (2/3 da tela) */}
      <div className="lg:col-span-2 space-y-4 overflow-y-auto max-h-[80vh]">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Histórico Operacional
            </h2>
        </div>

        {journals.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-10">Nenhum registro localizado.</p>
        )}

        {journals.map((journal) => (
            <div key={journal.id} className="wayne-panel p-4 border border-gray-800 hover:border-blue-500/30 transition-all bg-black/20">
                <div className="flex justify-between items-start mb-2 border-b border-gray-800/50 pb-2">
                    <div className="flex items-center gap-2 text-blue-500 font-mono text-xs">
                        <Clock size={12} />
                        <span>{formatDate(journal.createdAt)}</span>
                    </div>
                    <button 
                        onClick={() => deleteEntry(journal.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {journal.content}
                </p>
            </div>
        ))}
      </div>

    </div>
  );
}