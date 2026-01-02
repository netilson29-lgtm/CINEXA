
import React, { useState, useMemo } from 'react';
import { User, Generation, PlanType } from '../types';
import { Button } from '../components/Button';
import { geminiService } from '../services/geminiService';
import { supabaseService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { IMAGE_MODELS, ASPECT_RATIOS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  refreshUser: () => void;
}

export const GenerateImage: React.FC<Props> = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [modelId, setModelId] = useState(IMAGE_MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedModel = useMemo(() => 
    IMAGE_MODELS.find(m => m.id === modelId) || IMAGE_MODELS[0]
  , [modelId]);

  const handleGenerate = async () => {
    setError(null);
    if (!prompt.trim()) return;

    if (user.credits < 1 && !user.isAdmin) {
        setError("Créditos insuficientes.");
        return;
    }

    if (selectedModel.isPremium && user.plan === PlanType.FREE && !user.isAdmin) {
        setError(`O modelo ${selectedModel.name} é exclusivo para planos Plus e Premium.`);
        return;
    }

    setIsLoading(true);
    try {
        const imgUrl = await geminiService.generateImage(prompt, modelId, aspectRatio);
        
        const newGen: Generation = {
            id: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            type: 'IMAGE',
            prompt,
            status: 'COMPLETED',
            url: imgUrl,
            thumbnailUrl: imgUrl,
            createdAt: new Date().toISOString(),
            settings: { modelId, aspectRatio }
        };

        await supabaseService.db.createGeneration(newGen);
        
        if (!user.isAdmin) {
            await supabaseService.db.updateUserCredits(user.id, user.credits - 1);
            refreshUser();
        }

        navigate('/history');
    } catch (e) {
        setError("Erro ao gerar imagem.");
    } finally {
        setIsLoading(false);
    }
  };

  const getProviderBadgeColor = (provider: string) => {
    switch(provider) {
        case 'Midjourney': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'OpenAI': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Google DeepMind': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'Stability AI': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'Black Forest': return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
        default: return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-3">{t('gen.image.title')}</h1>
            <p className="text-zinc-400">{t('gen.image.subtitle')}</p>
        </div>

        <div className="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* Model Selector */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-2">{t('gen.model')}</label>
                <div className="relative">
                    <select 
                        value={modelId}
                        onChange={(e) => setModelId(e.target.value)}
                        className="glass-input w-full rounded-xl p-3 text-white appearance-none cursor-pointer text-lg font-medium"
                    >
                        {IMAGE_MODELS.map(m => (
                            <option key={m.id} value={m.id} className="bg-zinc-900 text-zinc-300">
                                {m.name} {m.version} {m.isPremium ? '★' : ''} - {m.provider}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">▼</div>
                </div>
                <div className="flex items-center gap-3 mt-3 bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border tracking-wider ${getProviderBadgeColor(selectedModel.provider)}`}>
                        {selectedModel.provider.toUpperCase()}
                    </span>
                    <span className="text-xs text-zinc-400">{selectedModel.description}</span>
                </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-2">{t('gen.aspect')}</label>
                <div className="grid grid-cols-5 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                        <button
                            key={ratio.id}
                            onClick={() => setAspectRatio(ratio.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                                aspectRatio === ratio.id 
                                ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                                : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                            }`}
                            title={ratio.desc}
                        >
                            <span className="text-sm font-bold">{ratio.label}</span>
                            <span className="text-[10px] opacity-60 mt-1 hidden sm:block">{ratio.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6 relative">
                 <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 rounded text-[10px] text-zinc-500 uppercase tracking-widest font-bold border border-white/5 pointer-events-none">
                    AI Prompt
                </div>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Descreva a imagem detalhadamente..."
                    className="glass-input w-full rounded-xl p-6 pt-10 text-white placeholder-zinc-600 focus:outline-none min-h-[150px] text-lg leading-relaxed resize-none"
                />
            </div>
            
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center">{error}</div>}
            
            <div className="flex items-center gap-4">
                <Button onClick={handleGenerate} isLoading={isLoading} className="flex-1 py-4 text-lg shadow-lg shadow-indigo-900/20">
                    {isLoading ? t('gen.loading') : 'Gerar Imagem (1 Crédito)'}
                </Button>
            </div>
            
            <p className="mt-4 text-center text-xs text-zinc-600">
                Processado via {selectedModel.provider} Cloud
            </p>
        </div>
    </div>
  );
};
