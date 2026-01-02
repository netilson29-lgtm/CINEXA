
import React, { useEffect, useState } from 'react';
import { User, Generation } from '../types';
import { supabaseService } from '../services/supabaseService';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
}

export const History: React.FC<Props> = ({ user }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Generation | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await supabaseService.db.getUserGenerations(user.id);
      setItems(data);
      setLoading(false);
    };
    fetchHistory();
  }, [user.id]);

  const handleDownload = (e: React.MouseEvent, item: Generation) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.url || '';
    link.target = '_blank';
    link.download = `aivision_${item.type.toLowerCase()}_${item.id}.${item.type === 'VIDEO' ? 'mp4' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  if (loading) return <div className="text-white text-center mt-10 animate-pulse">{t('common.loading')}</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{t('history.title')}</h1>
            <p className="text-zinc-400">{t('history.subtitle')}</p>
            <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1 font-medium bg-indigo-500/10 inline-block px-2 py-1 rounded border border-indigo-500/20">
                ℹ️ {t('history.retention')}
            </p>
        </div>
        <div className="text-xs text-zinc-500 font-mono">
            {items.length} ITENS
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] rounded-3xl border border-white/5 border-dashed">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-3xl">
                📂
            </div>
            <p className="text-zinc-400 font-medium">{t('history.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="group relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] cursor-pointer"
                >
                    {/* Thumbnail Area */}
                    <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                        {item.type === 'VIDEO' ? (
                            <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                                {/* Video Thumbnail Placeholder or Actual Video Muted Loop could go here */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                                     <span className="text-5xl opacity-50">🎬</span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-colors shadow-xl">
                                        <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                                <img src={item.url} alt="Gen" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                            </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3 z-20">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md border backdrop-blur-md uppercase tracking-wide ${
                                item.status === 'COMPLETED' 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            }`}>
                                {item.status}
                            </span>
                        </div>

                         {/* Type Badge */}
                         <div className="absolute top-3 right-3 z-20">
                            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-black/40 text-zinc-300 border border-white/10 backdrop-blur-md uppercase tracking-wide">
                                {item.type}
                            </span>
                        </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-5">
                        <p className="text-sm text-zinc-300 line-clamp-2 mb-4 h-10 leading-relaxed font-light">
                            {item.prompt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-xs text-zinc-500 font-mono">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                    title="Visualizar"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </button>
                                <button 
                                    onClick={(e) => handleDownload(e, item)}
                                    className="p-2 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/20 transition-all"
                                    title="Download"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
            <div 
                className="absolute inset-0" 
                onClick={() => setSelectedItem(null)}
            ></div>

            <div className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#050505] shrink-0">
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${selectedItem.type === 'VIDEO' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                            {selectedItem.type}
                        </span>
                        <span className="text-zinc-400 text-sm truncate max-w-[200px] md:max-w-md">
                            {selectedItem.id}
                        </span>
                    </div>
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    {/* Media Content */}
                    <div className="flex-1 bg-black flex items-center justify-center relative group overflow-hidden md:border-r border-white/5">
                        {/* Checkerboard pattern for transparency */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        {selectedItem.type === 'VIDEO' ? (
                            <video 
                                src={selectedItem.url} 
                                controls 
                                autoPlay 
                                className="max-h-[50vh] md:max-h-[70vh] w-auto max-w-full shadow-2xl"
                            />
                        ) : (
                            <img 
                                src={selectedItem.url} 
                                alt={selectedItem.prompt} 
                                className="max-h-[50vh] md:max-h-[70vh] w-auto max-w-full object-contain shadow-2xl"
                            />
                        )}
                    </div>

                    {/* Sidebar / Details & SEO */}
                    <div className="w-full md:w-80 bg-[#0f0f0f] flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="p-6 space-y-6">
                            
                            {/* Actions */}
                            <button 
                                onClick={(e) => handleDownload(e, selectedItem)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download
                            </button>

                            {/* Prompt Info */}
                            <div>
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Prompt</h4>
                                <p className="text-sm text-zinc-300 font-light italic border-l-2 border-indigo-500 pl-3">
                                    "{selectedItem.prompt}"
                                </p>
                            </div>

                            {/* SEO SECTION */}
                            {selectedItem.seo && (
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-emerald-400">📈</span>
                                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">SEO Master (YT + Google)</h4>
                                    </div>

                                    {/* Title */}
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 group relative">
                                        <label className="text-[10px] text-zinc-500 uppercase block mb-1">Title</label>
                                        <p className="text-sm text-white font-bold leading-tight">{selectedItem.seo.title}</p>
                                        <button 
                                            onClick={() => copyToClipboard(selectedItem.seo!.title)}
                                            className="absolute top-2 right-2 text-zinc-500 hover:text-white" title="Copy"
                                        >
                                            📋
                                        </button>
                                    </div>

                                    {/* Description */}
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 group relative">
                                        <label className="text-[10px] text-zinc-500 uppercase block mb-1">Description</label>
                                        <p className="text-xs text-zinc-300 whitespace-pre-wrap line-clamp-4 hover:line-clamp-none transition-all">{selectedItem.seo.description}</p>
                                        <button 
                                            onClick={() => copyToClipboard(selectedItem.seo!.description)}
                                            className="absolute top-2 right-2 text-zinc-500 hover:text-white" title="Copy"
                                        >
                                            📋
                                        </button>
                                    </div>

                                    {/* Tags */}
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 group relative">
                                        <label className="text-[10px] text-zinc-500 uppercase block mb-1">Tags</label>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedItem.seo.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-black/50 text-zinc-400 px-1.5 py-0.5 rounded">#{tag}</span>
                                            ))}
                                        </div>
                                         <button 
                                            onClick={() => copyToClipboard(selectedItem.seo!.tags.join(','))}
                                            className="absolute top-2 right-2 text-zinc-500 hover:text-white bg-[#0f0f0f] rounded-full p-1" title="Copy All"
                                        >
                                            📋
                                        </button>
                                    </div>
                                </div>
                            )}

                             {!selectedItem.seo && selectedItem.type === 'VIDEO' && (
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 text-center">
                                    <p className="text-xs text-zinc-500">SEO not generated for this video.</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
