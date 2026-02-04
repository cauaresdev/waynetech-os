import { useState, useEffect } from 'react';
import { Save, Trash2, Calendar, Clock, FileText } from 'lucide-react';

export default function JournalTab({ token }: { token: string }) {
  const [journals, setJournals] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // URL da API (Ajuste se necessário)
  const BASE_URL = 'https://arkham-backend.onrender.com'; 

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
        // Ordena do mais novo para o mais velho
        setJournals(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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
        body: JSON.stringify({ content }) // O Backend deve esperar { content }
      });
      setContent('');
      fetchJournals();
    } catch (error) {
      alert("Erro ao salvar no servidor seguro.");
    } finally {
      setIsLoading(false);
    }
  };
  const deleteEntry = async (id: number) => {
    if (!confirm("Confirmar eliminação de registro?")) return;
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

  // Função auxiliar para formatar data estilo militar
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')} ${d.getHours()}:${d.getMinutes()}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in h-full">
      
      {/* COLUNA DA ESQUERDA: NOVO REGISTRO (Ocupa 4 colunas) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="wayne-panel p-4 border-l-4 border-l-blue-600">
           <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
             <FileText size={14} /> Novo Log Operacional
           </h2>
           <textarea
             className="w-full h-64 bg-black/50 border border-gray-700 p-4 text-gray-300 text-sm focus:border-blue-500 outline-none resize-none font-mono"
             placeholder="Descreva o status da missão, reflexões ou dados táticos..."
             value={content}
             onChange={(e) => setContent(e.target.value)}
           />
           <div className="mt-2 flex justify-end">
             <button 
               onClick={saveEntry} 
               disabled={isLoading}
               className="bg-blue-900/30 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-800 text-xs font-bold py-2 px-6 uppercase tracking-widest transition-all flex items-center gap-2"
             >
               {isLoading ? 'ENCRIPTANDO...' : <><Save size={14} /> GRAVAR LOG</>}
             </button>
           </div>
        </div>
        
        {/* Card Informativo Rápido */}
        <div className="wayne-panel p-4">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total de Registros</div>
            <div className="text-2xl font-bold text-white font-mono">{journals.length} ARQUIVOS</div>
        </div>
      </div>

      {/* COLUNA DA DIREITA: LISTA DE LOGS (Ocupa 8 colunas) */}
      {/* 👇 AQUI ESTÁ A OTIMIZAÇÃO: Aumentei a altura e melhorei a rolagem */}
      <div className="lg:col-span-8 wayne-panel p-0 flex flex-col h-[150] overflow-hidden">
        
        <div className="p-4 border-b border-gray-800 bg-black/20 flex justify-between items-center">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Histórico de Arquivos
            </h2>
            <div className="text-[10px] text-gray-600 font-mono">ORDEM: CRONOLÓGICA INVERSA</div>
        </div>

        {/* Container com Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {journals.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                    <FileText size={48} className="mb-4" />
                    <p className="text-xs uppercase tracking-widest">Nenhum registro encontrado no servidor</p>
                </div>
            ) : (
                journals.map((journal) => (
                    <div key={journal.id} className="group bg-black/40 border border-gray-800 p-4 hover:border-blue-500/50 transition-all">
                        <div className="flex justify-between items-start mb-2 border-b border-gray-800/50 pb-2">
                            <div className="flex items-center gap-2 text-blue-500 font-mono text-xs">
                                <Clock size={12} />
                                <span>{formatDate(journal.createdAt)}</span>
                            </div>
                            <button 
                                onClick={() => deleteEntry(journal.id)}
                                className="text-gray-700 hover:text-red-500 transition-colors p-1"
                                title="Deletar permanentemente"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
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