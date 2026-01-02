import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AIAsset {
  id: string;
  type: 'VIDEO' | 'IMAGE';
  title: string;
  url: string;
  model: string;
  author: string;
  prompt: string;
}

const FEATURED_ASSETS: AIAsset[] = [
  {
    id: '1',
    type: 'VIDEO',
    title: 'Neon Tokyo Drift',
    url: 'https://images.unsplash.com/photo-1542259681-d4cd7093db29?q=80&w=1000&auto=format&fit=crop', 
    model: 'OpenAI Sora',
    author: 'AI_Master',
    prompt: 'Cinematic drone shot following a futuristic car drifting through neon-lit Tokyo streets in 2050, cyberpunk aesthetic, rain reflections, 8k resolution.'
  },
  {
    id: '2',
    type: 'IMAGE',
    title: 'Ethereal Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    model: 'Midjourney v6',
    author: 'CreativeSoul',
    prompt: 'Ultra-realistic portrait of a woman with bioluminescent flowers growing from her hair, soft studio lighting, bokeh background, fantasy style.'
  },
  {
    id: '3',
    type: 'VIDEO',
    title: 'Underwater Civilization',
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000&auto=format&fit=crop',
    model: 'Runway Gen-3',
    author: 'DeepDive',
    prompt: 'Wide shot of an ancient underwater city with glowing coral reefs and merfolk swimming, national geographic style documentary footage.'
  },
  {
    id: '4',
    type: 'IMAGE',
    title: 'Cybernetic Samurai',
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop',
    model: 'Flux Ultra',
    author: 'Ronin',
    prompt: 'Full body shot of a samurai robot with rusted metal armor holding a laser katana, standing in a foggy bamboo forest, dramatic lighting.'
  },
  {
    id: '5',
    type: 'VIDEO',
    title: 'Cosmic Voyage',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    model: 'Google Veo',
    author: 'StarWalker',
    prompt: 'Hyper-lapse of a spaceship travelling through a colorful nebula, high detail stars, cinematic orchestral atmosphere.'
  },
  {
    id: '6',
    type: 'IMAGE',
    title: 'Minimalist Architecture',
    url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000&auto=format&fit=crop',
    model: 'DALL-E 3',
    author: 'ArchiBot',
    prompt: 'Modern minimalist white concrete house in the middle of a desert, bright blue sky, sharp shadows, architectural photography.'
  }
];

export const Inspiration: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'VIDEO' | 'IMAGE'>('ALL');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredAssets = FEATURED_ASSETS.filter(
    asset => filter === 'ALL' || asset.type === filter
  );

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    alert('Prompt copiado para a área de transferência!');
  };

  const handleUsePrompt = (type: 'VIDEO' | 'IMAGE', prompt: string) => {
    navigator.clipboard.writeText(prompt);
    if (type === 'VIDEO') {
        navigate('/video');
    } else {
        navigate('/image');
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto pt-8">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Galeria de Inspiração ✨</h1>
        <p className="text-zinc-400 text-lg">
          Explore o estado da arte em geração procedural.
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-2">
        {['ALL', 'VIDEO', 'IMAGE'].map((type) => (
            <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                    filter === type 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
            >
                {type === 'ALL' ? 'Todos' : type === 'VIDEO' ? 'Vídeos' : 'Imagens'}
            </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAssets.map((asset) => (
            <div 
                key={asset.id} 
                className="group relative bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_rgba(79,70,229,0.15)]"
                onMouseEnter={() => setHoveredId(asset.id)}
                onMouseLeave={() => setHoveredId(null)}
            >
                {/* Image/Thumbnail */}
                <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                        src={asset.url} 
                        alt={asset.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />

                    {asset.type === 'VIDEO' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform shadow-lg">
                                <div className="ml-1 w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent"></div>
                            </div>
                        </div>
                    )}

                    <div className="absolute top-4 right-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-xl border border-white/10 shadow-lg tracking-wider ${
                            asset.model.includes('Midjourney') ? 'bg-purple-500/20 text-purple-200' :
                            asset.model.includes('Sora') || asset.model.includes('Veo') ? 'bg-blue-500/20 text-blue-200' :
                            'bg-orange-500/20 text-orange-200'
                        }`}>
                            {asset.model}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 relative -mt-12">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white leading-tight mb-1">{asset.title}</h3>
                            <p className="text-xs text-zinc-500">by @{asset.author}</p>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5 backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                        <p className="text-xs text-zinc-300 line-clamp-3 italic leading-relaxed">
                            "{asset.prompt}"
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleCopyPrompt(asset.prompt)}
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 text-xs py-3 rounded-xl transition-colors font-medium"
                        >
                            Copiar
                        </button>
                        <button 
                            onClick={() => handleUsePrompt(asset.type, asset.prompt)}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg text-white text-xs py-3 rounded-xl font-bold transition-all"
                        >
                            Usar Modelo
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};