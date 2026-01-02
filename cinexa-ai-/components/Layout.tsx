import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { supabaseService } from '../services/supabaseService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
}

export const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await supabaseService.auth.signOut();
    window.location.reload(); 
  };

  const navItems = [
    { label: t('nav.dashboard'), path: '/', icon: '📊' },
    { label: t('nav.video'), path: '/video', icon: '🎥' },
    { label: t('nav.image'), path: '/image', icon: '🎨' },
    { label: t('nav.thumbnail'), path: '/thumbnail', icon: '🖼️' },
    { label: t('nav.gallery'), path: '/inspiration', icon: '✨' },
    { label: t('nav.history'), path: '/history', icon: 'clock' },
    { label: t('nav.plans'), path: '/pricing', icon: '💎' },
  ];

  if (user.isAdmin) {
    navItems.push({ label: t('nav.admin'), path: '/admin', icon: '👑' });
  }

  return (
    <div className="min-h-screen text-zinc-100 flex selection:bg-brand-500/30">
      
      {/* Glass Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#030712]/80 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:inset-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-4">
          
          {/* Logo Area */}
          <div className="px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* CINEXA AI Logo Recreation */}
                <div className="relative w-10 h-10 flex items-center justify-center group">
                    <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 to-purple-600 [mask-image:linear-gradient(white,white)] origin-border border-t-cyan-400 border-r-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                    <svg className="w-4 h-4 text-white fill-white ml-1 relative z-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black tracking-wide text-white uppercase font-['Outfit'] leading-none">
                      CINEXA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI</span>
                    </h1>
                </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-zinc-400 hover:text-white transition-colors">
              ✕
            </button>
          </div>

          {/* Settings Group (Lang + Theme) */}
          <div className="px-4 mb-4 space-y-2">
            {/* Language Selector */}
            <div className="relative">
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-sm text-zinc-300 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                >
                    <option value="pt">🇵🇹 Português</option>
                    <option value="en">🇺🇸 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="fr">🇫🇷 Français</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 text-xs">▼</div>
            </div>

            {/* Theme Selector */}
            <div className="relative">
                <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-sm text-zinc-300 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                >
                    <option value="cosmic">🌌 {t('theme.cosmic')}</option>
                    <option value="aurora">❇️ {t('theme.aurora')}</option>
                    <option value="inferno">🔥 {t('theme.inferno')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 text-xs">▼</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 mt-2">
            <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Menu</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-brand-600/10 text-white shadow-[0_0_20px_rgba(var(--brand-500),0.1)] border border-brand-500/20' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100 hover:border hover:border-white/5 border border-transparent'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-full shadow-[0_0_10px_rgba(var(--brand-500),1)]" />}
                  <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Credits */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="glass-panel rounded-xl p-4 mb-4 relative overflow-hidden group">
                {/* Background glow effect */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl group-hover:bg-brand-500/30 transition-all duration-500"></div>
                
                <div className="text-xs font-medium text-zinc-400 mb-2 flex justify-between">
                    <span>{t('credits.remaining')}</span>
                    <Link to="/pricing" className="text-brand-400 hover:text-brand-300">{t('credits.upgrade')}</Link>
                </div>
                <div className="flex items-end gap-1 mb-2">
                    <span className="text-2xl font-bold text-white tracking-tight">{user.isAdmin ? '∞' : user.credits}</span>
                    <span className="text-xs text-zinc-500 mb-1">/ {t('credits.unlimited')}</span>
                </div>
                <div className="w-full bg-zinc-800/50 h-1.5 rounded-full overflow-hidden">
                    <div 
                    className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full shadow-[0_0_10px_rgba(var(--brand-500),0.5)]" 
                    style={{ width: user.isAdmin ? '100%' : `${Math.min((user.credits / 100) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <Link to="/profile" className="flex items-center gap-3 flex-1 group" title="Editar Perfil">
                <div className="relative">
                    <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 group-hover:border-brand-500 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#030712] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-white truncate group-hover:text-brand-400 transition-colors">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
              </Link>
              <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title={t('nav.logout')}>
                ↪
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Ambient Glows - Dynamic Colors */}
        <div className="absolute top-0 left-0 w-full h-96 bg-brand-900/10 blur-[120px] pointer-events-none transition-colors duration-500"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-900/10 blur-[120px] pointer-events-none transition-colors duration-500"></div>

        {/* Mobile Header */}
        <header className="h-16 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl flex items-center justify-between px-4 lg:hidden sticky top-0 z-40">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="text-zinc-400 p-2 hover:bg-white/5 rounded-lg">
               ☰
             </button>
             <span className="font-bold text-lg text-white">CINEXA AI</span>
           </div>
           <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-cyan-500 bg-gradient-to-tr from-cyan-900 to-purple-900"></div>
                <svg className="w-3 h-3 text-white fill-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 relative z-10 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
