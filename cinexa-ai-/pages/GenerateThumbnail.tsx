import React, { useState, useMemo } from 'react';
import { User, Generation, PlanType } from '../types';
import { Button } from '../components/Button';
import { geminiService } from '../services/geminiService';
import { supabaseService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { THUMBNAIL_MODELS } from '../constants';

interface Props {
  user: User;
  refreshUser: () => void;
}

const THUMBNAIL_STYLES = [
  { id: 'gaming', name: 'Gaming', desc: 'Neon, contraste alto, energético', color: '#ec4899' },
  { id: 'vlog', name: 'Vlog / Lifestyle', desc: 'Brilhante, rostos focados, limpo', color: '#facc15' },
  { id: 'business', name: 'Business / Tech', desc: 'Profissional, azul escuro, minimalista', color: '#3b82f6' },
  { id: 'news', name: 'Notícias / Impacto', desc: 'Sério, vermelho alerta, texto grande', color: '#ef4444' },
  { id: 'tutorial', name: 'Tutorial / How-To', desc: 'Instrutivo, setas, foco no objeto', color: '#10b981' },
];

export const GenerateThumbnail: React.FC<Props> = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [bgPrompt, setBgPrompt] = useState('');
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(THUMBNAIL_STYLES[0].id);
  const [selectedModelId, setSelectedModelId] = useState(THUMBNAIL_MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styleData = THUMBNAIL_STYLES.find(s => s.id === selectedStyle) || THUMBNAIL_STYLES[0];
  const selectedModel = useMemo(() => THUMBNAIL_MODELS.find(m => m.id === selectedModelId) || THUMBNAIL_MODELS[0], [selectedModelId]);

  const handleGenerate = async () => {
    setError(null);
    if (!bgPrompt.trim()) {
        setError("Descreva o fundo da sua thumbnail.");
        return;
    }
    if (!titleText.trim()) {
        setError("Adicione um título chamativo.");
        return;
    }

    if (user.credits < 1 && !user.isAdmin) {
        setError("Créditos insuficientes.");
        return;
    }

    // Check if user has access to premium models
    if (selectedModel.isPremium && user.plan === PlanType.FREE && !user.isAdmin) {
        setError(`O modelo ${selectedModel.name} é exclusivo para planos Plus e Premium.`);
        return;
    }

    setIsLoading(true);
    try {
        // We instruct the AI to generate the visual base, and we capture metadata
        const thumbUrl = await geminiService.generateThumbnail(bgPrompt, titleText, styleData.name, selectedModelId);
        
        const newGen: Generation = {
            id: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            type: 'THUMBNAIL',
            prompt: `Thumbnail (${selectedModel.name}): ${titleText} - ${bgPrompt}`,
            status: 'COMPLETED',
            url: thumbUrl,
            thumbnailUrl: thumbUrl,
            createdAt: new Date().toISOString(),
            settings: { 
                modelId: selectedModelId,
                style: selectedStyle,
                textOverlay: {
                    title: titleText,
                    subtitle: subtitleText,
                    colorTheme: styleData.color
                }
            }
        };

        await supabaseService.db.createGeneration(newGen);
        
        if (!user.isAdmin) {
            await supabaseService.db.updateUserCredits(user.id, user.credits - 1);
            refreshUser();
        }

        navigate('/history');
    } catch (e) {
        setError("Erro ao criar thumbnail.");
    } finally {
        setIsLoading(false);
    }
  };

  const getProviderBadgeColor = (provider: string) => {
    switch(provider) {
        case 'Ideogram': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
        case 'Midjourney': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'Black Forest': return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'; // Flux
        case 'OpenAI': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Thumbnail Maker ⚡</h1>
            <p className="text-zinc-400">Crie capas virais para YouTube com IA e tipografia otimizada.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* AI Model Selector - New Section */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs">1</span>
                    Modelo de Inteligência
                </h3>
                <div className="space-y-3">
                    <div className="relative">
                        <select 
                            value={selectedModelId}
                            onChange={(e) => setSelectedModelId(e.target.value)}
                            className="glass-input w-full rounded-xl p-3 text-white appearance-none cursor-pointer text-lg font-medium"
                        >
                            {THUMBNAIL_MODELS.map(m => (
                                <option key={m.id} value={m.id} className="bg-zinc-900 text-zinc-300">
                                    {m.name} {m.version} {m.isPremium ? '★' : ''} - {m.provider}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">▼</div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border tracking-wider ${getProviderBadgeColor(selectedModel.provider)}`}>
                            {selectedModel.provider.toUpperCase()}
                        </span>
                         <span className="text-xs text-zinc-400">{selectedModel.description}</span>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">2</span>
                    Estilo & Fundo
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {THUMBNAIL_STYLES.map(style => (
                        <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                                selectedStyle === style.id 
                                ? 'bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                                : 'bg-black/20 border-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className="w-full h-1 rounded-full mb-2" style={{ backgroundColor: style.color }}></div>
                            <div className="font-bold text-sm text-white">{style.name}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{style.desc}</div>
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase">Cenário / Imagem de Fundo</label>
                    <textarea 
                        value={bgPrompt}
                        onChange={(e) => setBgPrompt(e.target.value)}
                        placeholder="Ex: Um setup gamer futurista com luzes neon roxas, expressão de surpresa, fundo desfocado..."
                        className="glass-input w-full rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none min-h-[80px] text-sm resize-none"
                    />
                </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs">3</span>
                    Tipografia Viral
                </h3>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Texto Principal (Chamativo)</label>
                        <input 
                            type="text"
                            value={titleText}
                            onChange={(e) => setTitleText(e.target.value)}
                            placeholder="Ex: INACREDITÁVEL!"
                            maxLength={25}
                            className="glass-input w-full rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none text-lg font-bold tracking-wide"
                        />
                         <p className="text-[10px] text-zinc-600 text-right">{titleText.length}/25 caracteres</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Texto Secundário (Opcional)</label>
                        <input 
                            type="text"
                            value={subtitleText}
                            onChange={(e) => setSubtitleText(e.target.value)}
                            placeholder="Ex: Ganhei $1M em 1 dia"
                            maxLength={40}
                            className="glass-input w-full rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

             {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">{error}</div>}

            <Button onClick={handleGenerate} isLoading={isLoading} className="w-full py-4 text-lg font-bold shadow-lg shadow-indigo-900/20">
                {isLoading ? 'Renderizando Thumbnail...' : 'Gerar Thumbnail (1 Crédito)'}
            </Button>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-5">
            <div className="sticky top-6">
                <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-4 shadow-2xl">
                    <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest flex justify-between">
                        <span>Preview (Simulação)</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">16:9</span>
                    </h3>

                    {/* Simulation Canvas */}
                    <div className="aspect-video w-full bg-zinc-800 rounded-lg relative overflow-hidden group shadow-inner">
                        {/* Background Placeholder */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-50 transition-opacity" style={{ 
                            backgroundImage: 'url(https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000)',
                            filter: 'blur(2px)'
                        }}></div>
                        
                        {/* Dynamic Overlay based on Style */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                            
                            {/* Title Render */}
                            <h2 
                                className="text-5xl md:text-6xl font-black text-white uppercase leading-none mb-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] transition-all duration-300"
                                style={{ 
                                    textShadow: `4px 4px 0px ${styleData.color}, -2px -2px 0 #000`,
                                    transform: 'rotate(-2deg)'
                                }}
                            >
                                {titleText || "SEU TÍTULO"}
                            </h2>

                            {/* Subtitle Render */}
                            {subtitleText && (
                                <span className="text-xl md:text-2xl font-bold text-white bg-black/80 px-4 py-1 rounded-lg transform rotate-1 border-b-4" style={{ borderColor: styleData.color }}>
                                    {subtitleText}
                                </span>
                            )}
                        </div>

                        {/* Style Badge overlay */}
                        <div className="absolute top-4 left-4 flex gap-2">
                             <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-mono text-zinc-300">
                                {styleData.name}
                             </div>
                             <div className={`backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-bold tracking-wide ${getProviderBadgeColor(selectedModel.provider)}`}>
                                {selectedModel.provider}
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
                        <h4 className="text-xs font-bold text-white mb-2">Poder da IA Escolhida:</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            {selectedModel.description} Para resultados ideais, modelos como <strong>Ideogram</strong> integram o texto diretamente na imagem, enquanto modelos como <strong>Midjourney</strong> focam na beleza visual (o texto pode precisar de ajuste).
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};