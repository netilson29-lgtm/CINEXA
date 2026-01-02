
import React, { useState, useMemo } from 'react';
import { User, Generation, PlanType, Voice } from '../types';
import { PLANS, MOCK_VOICES, LANGUAGES, VIDEO_STYLES, VIDEO_MODELS, MUSIC_STYLES, ASPECT_RATIOS } from '../constants';
import { Button } from '../components/Button';
import { geminiService } from '../services/geminiService';
import { supabaseService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  refreshUser: () => void;
}

export const GenerateVideo: React.FC<Props> = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState(VIDEO_STYLES[0]);
  const [voice, setVoice] = useState(MOCK_VOICES[0].id);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [modelId, setModelId] = useState(VIDEO_MODELS[0].id);
  const [musicStyle, setMusicStyle] = useState(MUSIC_STYLES[0]);
  const [soundEffects, setSoundEffects] = useState(true);
  const [captions, setCaptions] = useState(false);
  const [seoEnabled, setSeoEnabled] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planLimit = PLANS[user.plan].maxVideoDuration;

  const selectedVoice = useMemo(() => 
    MOCK_VOICES.find(v => v.id === voice) || MOCK_VOICES[0]
  , [voice]);

  const selectedModel = useMemo(() => 
    VIDEO_MODELS.find(m => m.id === modelId) || VIDEO_MODELS[0]
  , [modelId]);

  // Group voices by Provider
  const groupedVoices = useMemo(() => {
    // Filter voices that match selected language OR are multi-lingual
    const available = MOCK_VOICES.filter(v => {
        if (v.language.includes('Multi-lingual')) return true;
        const langRoot = language.split(' ')[0];
        // Simple fuzzy match for language
        return v.language.includes(langRoot) || language.includes(v.language);
    });

    const groups: Record<string, typeof MOCK_VOICES> = {};
    
    // Sort to keep Providers together
    available.forEach(v => {
        if (!groups[v.provider]) groups[v.provider] = [];
        groups[v.provider].push(v);
    });

    return groups;
  }, [language]);

  const handleGenerate = async () => {
    setError(null);
    if (!prompt.trim()) {
        setError(t('error.prompt'));
        return;
    }

    if (duration > planLimit && !user.isAdmin) {
        setError(`Limit: ${planLimit} min. Upgrade required.`);
        return;
    }

    // Check if user has access to premium models
    if (selectedModel.isPremium && user.plan === PlanType.FREE && !user.isAdmin) {
        setError(`${selectedModel.name}: Premium only.`);
        return;
    }

    const cost = Math.ceil(duration / 2);
    if (user.credits < cost && !user.isAdmin) {
        setError(t('error.credits'));
        return;
    }

    setIsLoading(true);

    try {
        // Parallel execution: Generate Video AND SEO (if enabled)
        const audioConfig = { musicStyle, soundEffects };
        const videoPromise = geminiService.generateVideo(prompt, modelId, undefined, captions, audioConfig, aspectRatio);
        const seoPromise = seoEnabled 
            ? geminiService.generateSEO(prompt, language) 
            : Promise.resolve(undefined);

        const [videoUrl, seoData] = await Promise.all([videoPromise, seoPromise]);

        if (!videoUrl) throw new Error("URL de vídeo inválida retornada.");

        const newGen: Generation = {
            id: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            type: 'VIDEO',
            prompt,
            status: 'COMPLETED',
            url: videoUrl,
            thumbnailUrl: 'https://picsum.photos/400/300',
            createdAt: new Date().toISOString(),
            settings: { 
                duration, 
                style, 
                voiceId: voice, 
                language, 
                modelId, 
                captions,
                seoEnabled,
                audioConfig,
                aspectRatio
            },
            seo: seoData // Attach generated SEO data
        };

        await supabaseService.db.createGeneration(newGen);

        if (!user.isAdmin) {
            await supabaseService.db.updateUserCredits(user.id, user.credits - cost);
            refreshUser();
        }
        
        navigate('/history');

    } catch (e: any) {
        console.error(e);
        setError("Error. Try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const getProviderBadgeColor = (provider: string) => {
    switch(provider) {
        case 'ElevenLabs': return 'bg-[#F25C05]/20 text-[#F25C05] border-[#F25C05]/30';
        case 'OpenAI': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Google DeepMind': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'Runway': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'Luma AI': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Kuaishou': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('gen.video.title')}</h1>
        <p className="text-zinc-400">{t('gen.video.subtitle')}</p>
      </div>
      
      <div className="glass-panel rounded-2xl p-8 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Settings */}
            <div className="lg:col-span-7 space-y-8">
                
                {/* AI Model Selector */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('gen.model')}</label>
                    <div className="relative">
                        <select 
                            value={modelId}
                            onChange={(e) => setModelId(e.target.value)}
                            className="glass-input w-full rounded-xl p-3 text-white appearance-none cursor-pointer text-lg font-medium"
                        >
                            {VIDEO_MODELS.map(m => (
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

                {/* Prompt */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('gen.prompt')}</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="..."
                        className="glass-input w-full rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none min-h-[120px] resize-none text-base"
                    />
                </div>

                {/* Aspect Ratio Selector (NEW) */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('gen.aspect')}</label>
                    <div className="grid grid-cols-5 gap-2">
                        {ASPECT_RATIOS.map((ratio) => (
                            <button
                                key={ratio.id}
                                onClick={() => setAspectRatio(ratio.id)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                    aspectRatio === ratio.id 
                                    ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                                    : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                                }`}
                                title={ratio.desc}
                            >
                                <span className="text-xs font-bold">{ratio.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duration Slider */}
                <div className="space-y-4 bg-white/5 rounded-xl p-5 border border-white/5">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('gen.duration')}</label>
                        <span className="text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">{duration} min</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="80" 
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                    />
                    <div className="flex justify-between text-xs text-zinc-500 font-medium">
                        <span>1 min</span>
                        <span className={duration > planLimit ? 'text-red-400' : ''}>Limit: {planLimit} min</span>
                        <span>80 min</span>
                    </div>
                </div>

                {/* Selectors Grid */}
                <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('gen.style')}</label>
                        <div className="relative">
                            <select 
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="glass-input w-full rounded-xl p-3 text-white appearance-none cursor-pointer"
                            >
                                {VIDEO_STYLES.map(s => <option key={s} value={s} className="bg-zinc-900 text-zinc-300">{s}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">▼</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('gen.lang')}</label>
                        <div className="relative">
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="glass-input w-full rounded-xl p-3 text-white appearance-none cursor-pointer"
                            >
                                {LANGUAGES.map(l => <option key={l} value={l} className="bg-zinc-900 text-zinc-300">{l}</option>)}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">▼</div>
                        </div>
                    </div>
                </div>

                {/* Audio & Atmosphere Section */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-zinc-900/50 p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🎵</span>
                        <label className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('gen.audio.title')}</label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Music Style */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">{t('gen.audio.music')}</label>
                            <div className="relative">
                                <select 
                                    value={musicStyle}
                                    onChange={(e) => setMusicStyle(e.target.value)}
                                    className="glass-input w-full rounded-xl p-3 text-white appearance-none cursor-pointer"
                                >
                                    {MUSIC_STYLES.map(s => <option key={s} value={s} className="bg-zinc-900 text-zinc-300">{s}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">▼</div>
                            </div>
                        </div>

                        {/* Sound Effects Toggle */}
                        <div className="space-y-2">
                             <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide">{t('gen.audio.sfx')}</label>
                             <div className="bg-black/20 rounded-xl p-2.5 flex items-center justify-between border border-white/5">
                                <span className="text-sm text-zinc-300 pl-2">{soundEffects ? 'ON (Immersive)' : 'OFF'}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={soundEffects}
                                        onChange={() => setSoundEffects(!soundEffects)}
                                    />
                                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Features Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Captions Toggle */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setCaptions(!captions)}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${captions ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                <span className="font-bold text-xs">CC</span>
                            </div>
                            <div>
                                <span className="block text-sm font-semibold text-white">{t('gen.captions')}</span>
                                <span className="text-[10px] text-zinc-400">Sync auto.</span>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors relative ${captions ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${captions ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    {/* SEO Toggle */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setSeoEnabled(!seoEnabled)}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${seoEnabled ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                <span className="font-bold text-lg">🚀</span>
                            </div>
                            <div>
                                <span className="block text-sm font-semibold text-white">{t('gen.seo')}</span>
                                <span className="text-[10px] text-zinc-400">Dual Opt.</span>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors relative ${seoEnabled ? 'bg-emerald-600' : 'bg-zinc-700'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${seoEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                </div>

                {/* Voice Provider Integration */}
                <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/10 p-5 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('gen.voice')}</label>
                         <span className={`text-[10px] font-bold px-2 py-1 rounded border tracking-wider ${getProviderBadgeColor(selectedVoice.provider)}`}>
                            {selectedVoice.provider.toUpperCase()}
                         </span>
                    </div>
                    <div className="relative">
                        <select 
                            value={voice}
                            onChange={(e) => setVoice(e.target.value)}
                            className="glass-input w-full rounded-xl p-3 text-white appearance-none cursor-pointer"
                        >
                            {Object.entries(groupedVoices).map(([provider, voices]) => (
                                <optgroup key={provider} label={provider} className="bg-zinc-900 text-white font-bold">
                                    {(voices as Voice[]).map(v => (
                                        <option key={v.id} value={v.id} className="text-zinc-300 font-normal">
                                            {v.name} ({v.category})
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">▼</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-zinc-500">Preview:</span>
                        <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                             <div className="h-full w-1/3 bg-zinc-600 rounded-full"></div>
                        </div>
                        <span className="text-[10px] text-zinc-500">▶</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Preview / Cost */}
            <div className="lg:col-span-5 flex flex-col">
                <div className="sticky top-6 flex flex-col h-full bg-[#0a0a0a] rounded-2xl p-6 border border-white/10 shadow-2xl shadow-black">
                    <div className="w-full aspect-video rounded-xl bg-zinc-900/50 mb-6 flex items-center justify-center border border-white/5 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                         <div className="text-center z-10">
                            <span className="text-4xl block mb-2 opacity-50">🎬</span>
                            <span className="text-xs text-zinc-500 uppercase tracking-widest">Preview</span>
                         </div>
                         {captions && (
                            <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                                <span className="inline-block bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-medium">
                                    [Preview]
                                </span>
                            </div>
                         )}
                         {seoEnabled && (
                             <div className="absolute top-4 right-4 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg flex items-center gap-1">
                                 <span>📈</span> YT + Google
                             </div>
                         )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Info</h3>
                    
                    <div className="space-y-4 text-sm text-zinc-400 flex-1">
                        <div className="flex justify-between items-center">
                            <span>AI Model</span>
                            <span className="text-white font-bold">{selectedModel.name} {selectedModel.version}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Cost</span>
                            <span className="text-white font-bold bg-white/10 px-2 py-1 rounded">{Math.ceil(duration / 2)} Credits</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span>Size</span>
                            <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">{aspectRatio}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Resolution</span>
                            <span className="text-white">{user.plan === PlanType.FREE ? 'HD 720p' : '4K Ultra HD'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Audio</span>
                            <span className="text-white font-medium max-w-[150px] truncate text-right">{musicStyle} {soundEffects ? '+ SFX' : ''}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span>{t('gen.captions')}</span>
                            <span className={`${captions ? 'text-green-400' : 'text-zinc-500'}`}>
                                {captions ? 'ON' : 'OFF'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>{t('gen.seo')}</span>
                            <span className={`${seoEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                {seoEnabled ? 'Power' : 'Basic'}
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 mt-4">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="mt-6 space-y-3">
                        <Button 
                            onClick={handleGenerate} 
                            isLoading={isLoading} 
                            className="w-full py-4 text-lg shadow-lg shadow-indigo-900/20"
                            disabled={user.credits < Math.ceil(duration / 2) && !user.isAdmin}
                        >
                            {isLoading ? t('gen.loading') : t('gen.submit')}
                        </Button>
                        <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest">
                            Secure Processing via {selectedModel.provider}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
