import { useState, useEffect } from 'react';
import { Save, Trash2, Calendar, Clock, FileText } from 'lucide-react';

export default function JournalTab({ token }: { token: string }) {
  const [journals, setJournals] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        // Ordena por data (mais novo primeiro) com segurança
        setJournals(data.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.date || Date.now()).getTime();
            const dateB = new Date(b.createdAt || b.date || Date.now()).getTime();
            return dateB - dateA;
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar diários", error);
    }
  };

  const saveEntry = async () => {
    if (!content.trim()) return;
    setIsLoading(true);
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
      alert("Erro de conexão ao salvar.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = async (id: number) => {
    if (!confirm("Deletar registro permanentemente?")) return;
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

  // 🛡️ FORMATAÇÃO DE DATA BLINDADA
  const formatDate = (dateString: string) => {
    try {
        if (!dateString) return "DATA DESCONHECIDA";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "ERRO DATA"; // Proteção contra NaN
        
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch (e) {
        return "DATA INVÁLIDA";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in h-full">
      
      {/* EDITOR (Esquerda) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="wayne-panel p-4 border-l-4 border-l-blue-600">
           <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
             <FileText size={14} /> Novo Log
           </h2>
           <textarea
             className="w-full h-48 bg-black/50 border border-gray-700 p-4 text-gray-300 text-sm focus:border-blue-500 outline-none resize-none font-mono"
             placeholder="Digite seu relatório tático..."
             value={content}
             onChange={(e) => setContent(e.target.value)}
           />
           <div className="mt-2 flex justify-end">
             <button 
               onClick={saveEntry} 
               disabled={isLoading}
               className="bg-blue-900/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-800 text-xs font-bold py-2 px-4 uppercase tracking-widest transition-all flex items-center gap-2"
             >
               {isLoading ? 'SALVANDO...' : <><Save size={14} /> GRAVAR</>}
             </button>
           </div>
        </div>
        
        <div className="wayne-panel p-4 flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase">Arquivos Totais</span>
            <span className="text-xl font-bold text-white font-mono">{journals.length}</span>
        </div>
      </div>

      {/* LISTA (Direita) - CORREÇÃO DE ALTURA AQUI 👇 */}
      <div 
        className="lg:col-span-8 wayne-panel p-0 flex flex-col overflow-hidden" 
        style={{ height: '550px' }} 
      >
        <div className="p-4 border-b border-gray-800 bg-black/20 flex justify-between items-center shrink-0">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Histórico
            </h2>
            <div className="text-[10px] text-gray-600 font-mono">ORDEM: CRONOLÓGICA INVERSA</div>
        </div>

        {/* Área de Rolagem */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {journals.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                    <p className="text-xs uppercase tracking-widest">Nenhum registro</p>
                </div>
            ) : (
                journals.map((journal) => (
                    <div key={journal.id} className="group bg-black/40 border border-gray-800 p-4 hover:border-blue-500/50 transition-all shrink-0">
                        <div className="flex justify-between items-start mb-2 border-b border-gray-800/50 pb-2">
                            <div className="flex items-center gap-2 text-blue-500 font-mono text-xs">
                                <Clock size={12} />
                                <span>{formatDate(journal.createdAt || journal.date)}</span>
                            </div>
                            <button 
                                onClick={() => deleteEntry(journal.id)}
                                className="text-gray-700 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                        {/* Quebra de linha forçada para não cortar texto */}
                        <p className="text-sm text-gray-300 font-sans leading-relaxed whitespace-pre-wrap wrap-break-words">
                            {journal.content}
                        </p>
                    </div>
                ))
            )}
        </div>
      </div>

    </div>
  );
}