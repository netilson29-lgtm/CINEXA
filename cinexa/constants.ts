
import { PlanType, PlanDetails, Voice, AIModel } from './types';

export const APP_NAME = "CINEXA AI";

export const PLANS: Record<PlanType, PlanDetails> = {
  [PlanType.FREE]: {
    id: PlanType.FREE,
    name: 'Free Starter',
    price: 0,
    credits: 10,
    features: ['Marca d\'água nos vídeos', '720p Qualidade', 'Suporte Básico'],
    maxVideoDuration: 5,
    hasWatermark: true,
  },
  [PlanType.PLUS]: {
    id: PlanType.PLUS,
    name: 'Plus Creator',
    price: 29,
    credits: 100,
    features: ['Sem marca d\'água', '1080p Qualidade', 'Vozes Premium', 'Geração Rápida'],
    maxVideoDuration: 20,
    hasWatermark: false,
  },
  [PlanType.PREMIUM]: {
    id: PlanType.PREMIUM,
    name: 'Pro Studio',
    price: 99,
    credits: 500,
    features: ['4K Qualidade', 'Prioridade Máxima', 'API Access', 'Vídeos de 80min'],
    maxVideoDuration: 80,
    hasWatermark: false,
  }
};

export const VIDEO_MODELS: AIModel[] = [
  { id: 'veo_3', name: 'Veo', version: '3.1', provider: 'Google DeepMind', description: 'Equilibrado e rápido. Ótimo para vídeos longos.', isPremium: false },
  { id: 'sora_1', name: 'Sora', version: '1.0 Turbo', provider: 'OpenAI', description: 'Realismo cinematográfico extremo. Física complexa.', isPremium: true },
  { id: 'gen_3', name: 'Gen-3 Alpha', version: 'Alpha', provider: 'Runway', description: 'Controle criativo preciso e estilos artísticos.', isPremium: true },
  { id: 'kling_ai', name: 'Kling', version: '1.5', provider: 'Kuaishou', description: 'Alta resolução e movimento fluido de personagens.', isPremium: true },
  { id: 'luma_dream', name: 'Dream Machine', version: '1.0', provider: 'Luma AI', description: 'Excelente para transformações e morphing.', isPremium: false },
];

export const IMAGE_MODELS: AIModel[] = [
  { id: 'imagen_3', name: 'Imagen', version: '3.0', provider: 'Google DeepMind', description: 'Fotorealismo e tipografia precisa.', isPremium: false },
  { id: 'midjourney_v6', name: 'Midjourney', version: 'v6.1', provider: 'Midjourney', description: 'Estilo artístico inigualável e criatividade.', isPremium: true },
  { id: 'dalle_3', name: 'DALL-E', version: '3.0', provider: 'OpenAI', description: 'Fidelidade ao prompt e composição complexa.', isPremium: false },
  { id: 'flux_pro', name: 'Flux', version: '1.1 Pro', provider: 'Black Forest', description: 'A nova referência em detalhes e anatomia.', isPremium: true },
  { id: 'stable_3', name: 'Stable Diffusion', version: '3.5 Large', provider: 'Stability AI', description: 'Versatilidade e controle de estilo.', isPremium: false },
];

export const THUMBNAIL_MODELS: AIModel[] = [
  { id: 'ideogram_2', name: 'Ideogram', version: 'v2 Turbo', provider: 'Ideogram', description: 'O melhor do mundo para renderização de texto (Tipografia).', isPremium: false },
  { id: 'midjourney_v6', name: 'Midjourney', version: 'v6.1', provider: 'Midjourney', description: 'Estética "clickbait" vibrante e composição artística superior.', isPremium: true },
  { id: 'flux_1_pro', name: 'Flux', version: '1.1 Pro', provider: 'Black Forest', description: 'Realismo extremo e obediência total ao prompt.', isPremium: true },
  { id: 'dalle_3', name: 'DALL-E', version: '3.0', provider: 'OpenAI', description: 'Ótimo para seguir instruções complexas de layout.', isPremium: false },
  { id: 'imagen_3', name: 'Imagen', version: '3.0', provider: 'Google DeepMind', description: 'Rápido e eficiente para thumbnails simples.', isPremium: false },
];

export const MOCK_VOICES: Voice[] = [
  // ElevenLabs
  { id: 'eleven_turbo_adam', name: 'Adam', category: 'Conversational', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: '' },
  { id: 'eleven_turbo_rachel', name: 'Rachel', category: 'Narrative', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: '' },
  { id: 'eleven_turbo_eleven', name: 'Eleven', category: 'Dark/Deep', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: '' },
  { id: 'eleven_turbo_drew', name: 'Drew', category: 'News Anchor', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: '' },
  { id: 'eleven_turbo_clyde', name: 'Clyde', category: 'Deep', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: '' },
  { id: 'eleven_turbo_mimi', name: 'Mimi', category: 'Childish', language: 'Multi-lingual', provider: 'ElevenLabs', previewUrl: '' },
  
  // OpenAI
  { id: 'openai_alloy', name: 'Alloy', category: 'Neutral', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: '' },
  { id: 'openai_echo', name: 'Echo', category: 'Warm', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: '' },
  { id: 'openai_fable', name: 'Fable', category: 'British', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: '' },
  { id: 'openai_onyx', name: 'Onyx', category: 'Deep/Man', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: '' },
  { id: 'openai_nova', name: 'Nova', category: 'Energetic', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: '' },
  { id: 'openai_shimmer', name: 'Shimmer', category: 'Clear', language: 'Multi-lingual', provider: 'OpenAI', previewUrl: '' },

  // Google Cloud
  { id: 'google_journey_f', name: 'Journey (F)', category: 'Storytelling', language: 'Multi-lingual', provider: 'Google Cloud', previewUrl: '' },
  { id: 'google_journey_m', name: 'Journey (M)', category: 'Storytelling', language: 'Multi-lingual', provider: 'Google Cloud', previewUrl: '' },
  { id: 'google_studio_f', name: 'Studio Voice A', category: 'Professional', language: 'Multi-lingual', provider: 'Google Cloud', previewUrl: '' },
  
  // Azure AI
  { id: 'azure_ava', name: 'Ava', category: 'Professional', language: 'Multi-lingual', provider: 'Azure AI', previewUrl: '' },
  { id: 'azure_andrew', name: 'Andrew', category: 'Warm', language: 'Multi-lingual', provider: 'Azure AI', previewUrl: '' },
  { id: 'azure_brian', name: 'Brian', category: 'Documentary', language: 'Multi-lingual', provider: 'Azure AI', previewUrl: '' },

  // Play.ht
  { id: 'playht_william', name: 'William', category: 'Advertising', language: 'Multi-lingual', provider: 'Play.ht', previewUrl: '' },
  { id: 'playht_sophia', name: 'Sophia', category: 'Soft', language: 'Multi-lingual', provider: 'Play.ht', previewUrl: '' },

  // Native Specific (Legacy/Standard)
  { id: 'pt_native_1', name: 'António', category: 'Narrative', language: 'Português', provider: 'Azure AI', previewUrl: '' },
  { id: 'pt_native_2', name: 'Vitória', category: 'Soft', language: 'Português', provider: 'Azure AI', previewUrl: '' },
  { id: 'pt_br_native_1', name: 'Brenda', category: 'Commercial', language: 'Português (BR)', provider: 'Google Cloud', previewUrl: '' },
  { id: 'pt_br_native_2', name: 'Donato', category: 'Deep', language: 'Português (BR)', provider: 'ElevenLabs', previewUrl: '' },
  { id: 'es_native_1', name: 'Sergio', category: 'Warm', language: 'Spanish', provider: 'OpenAI', previewUrl: '' },
  { id: 'fr_native_1', name: 'Benoit', category: 'Formal', language: 'French', provider: 'Google Cloud', previewUrl: '' },
  { id: 'de_native_1', name: 'Gunther', category: 'Authoritative', language: 'German', provider: 'Azure AI', previewUrl: '' },
  { id: 'jp_native_1', name: 'Kyoko', category: 'Anime', language: 'Japanese', provider: 'Play.ht', previewUrl: '' },
];

export const VIDEO_STYLES = [
  'Cinematic', 'Anime', 'Photorealistic', '3D Render', 'Minimalist', 'Cyberpunk', 'Watercolor', 'Noir', 'Vaporwave', 'Documentary', 'Fantasy'
];

export const MUSIC_STYLES = [
    'Cinematic / Epic', 
    'Lo-Fi / Chill', 
    'Cyberpunk / Synthwave', 
    'Corporate / Upbeat', 
    'Horror / Suspense', 
    'Nature / Ambient',
    'Jazz / Lounge',
    'Rock / High Energy',
    'None / Silence'
];

export const LANGUAGES = [
  'Português (PT)', 'Português (BR)', 'English (US)', 'English (UK)', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Mandarin', 'Hindi', 'Arabic'
];

export const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9', desc: 'Youtube / TV' },
  { id: '9:16', label: '9:16', desc: 'TikTok / Reels' },
  { id: '1:1', label: '1:1', desc: 'Square / Feed' },
  { id: '4:3', label: '4:3', desc: 'Classic' },
  { id: '3:4', label: '3:4', desc: 'Portrait' }
];
