
import React, { useState } from 'react';
import { User } from '../types';
import { supabaseService } from '../services/supabaseService';
import { Button } from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  refreshUser: () => void;
}

export const Profile: React.FC<Props> = ({ user, refreshUser }) => {
  const { t } = useLanguage();
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const updatedUser = { ...user, name, avatarUrl };
      await supabaseService.db.updateUser(updatedUser);
      await refreshUser();
      setMessage({ type: 'success', text: t('profile.success') });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('profile.title')}</h1>
        <p className="text-zinc-400">{t('profile.subtitle')}</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel rounded-2xl p-8 space-y-6">
        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
              <img 
                src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('profile.name')}</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input w-full rounded-xl p-3 text-white focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('profile.email')}</label>
          <input 
            type="text" 
            value={user.email}
            disabled
            className="glass-input w-full rounded-xl p-3 text-zinc-500 cursor-not-allowed bg-black/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">{t('profile.avatar')}</label>
          <input 
            type="text" 
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="glass-input w-full rounded-xl p-3 text-white focus:outline-none font-mono text-sm"
          />
          <p className="text-xs text-zinc-500">Paste an image URL from Unsplash or elsewhere.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <Button 
          type="submit" 
          isLoading={isLoading}
          className="w-full py-4 text-lg"
        >
          {isLoading ? t('profile.saving') : t('profile.save')}
        </Button>
      </form>
    </div>
  );
};
