import React from 'react';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            {t('dashboard.hello')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">{user.name}</span>
          </h1>
          <p className="text-zinc-400 text-lg">{t('dashboard.subtitle')}</p>
        </div>
        <Link to="/video">
          <button className="bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1">
            {t('dashboard.new_project')}
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl">💎</span>
            </div>
          <div className="text-zinc-400 text-sm font-medium mb-1 uppercase tracking-wider">{t('dashboard.credits')}</div>
          <div className="text-4xl font-bold text-white mb-2">{user.isAdmin ? '∞' : user.credits}</div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
             <span>{t('dashboard.renews')}</span>
          </div>
        </div>
        
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl">🚀</span>
            </div>
          <div className="text-zinc-400 text-sm font-medium mb-1 uppercase tracking-wider">{t('dashboard.plan')}</div>
          <div className="text-4xl font-bold text-brand-400 mb-2">{user.plan}</div>
          <Link to="/pricing" className="text-sm text-zinc-300 hover:text-white border-b border-zinc-600 hover:border-white transition-colors">{t('dashboard.upgrade_link')}</Link>
        </div>

        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl">⚡</span>
            </div>
          <div className="text-zinc-400 text-sm font-medium mb-1 uppercase tracking-wider">{t('dashboard.status')}</div>
          <div className="flex items-center gap-3 mb-2 mt-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xl font-bold text-white">Online</span>
          </div>
          <div className="text-xs text-zinc-500">Gemini 1.5 Pro & ElevenLabs V2 Turbo</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-brand-500 rounded-full"></span>
            {t('dashboard.start')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/video" className="group relative overflow-hidden rounded-3xl h-64 border border-white/10 transition-all duration-500 hover:border-brand-500/50 hover:shadow-[0_0_30px_rgba(var(--brand-500),0.2)]">
            <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                alt="Video AI" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-brand-600 group-hover:border-brand-400 transition-colors">
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{t('card.video.title')}</h3>
              <p className="text-zinc-300 text-sm">{t('card.video.desc')}</p>
            </div>
          </Link>

          <Link to="/image" className="group relative overflow-hidden rounded-3xl h-64 border border-white/10 transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
             <img 
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop" 
                alt="Image AI" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-emerald-600 group-hover:border-emerald-400 transition-colors">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{t('card.image.title')}</h3>
              <p className="text-zinc-300 text-sm">{t('card.image.desc')}</p>
            </div>
          </Link>

          <Link to="/thumbnail" className="group relative overflow-hidden rounded-3xl h-64 border border-white/10 transition-all duration-500 hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
             <img 
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" 
                alt="Thumbnail AI" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-yellow-600 group-hover:border-yellow-400 transition-colors">
                <span className="text-2xl">🖼️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{t('card.thumb.title')}</h3>
              <p className="text-zinc-300 text-sm">{t('card.thumb.desc')}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};