import React, { useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Button } from '../components/Button';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await supabaseService.auth.signIn(email, password);
      } else {
        res = await supabaseService.auth.signUp(email, name, password);
      }

      if (res.error) {
        setError(res.error);
      } else if (res.user) {
        onLogin(res.user);
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="max-w-md w-full glass-panel p-10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] relative z-10 border border-white/10 backdrop-blur-2xl">
        <div className="text-center mb-10">
          {/* Logo Recreation */}
          <div className="inline-flex relative w-20 h-20 items-center justify-center mb-6">
               <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-cyan-400 to-purple-600 [mask-image:linear-gradient(white,white)] origin-border border-t-cyan-400 border-r-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.6)] animate-[spin_10s_linear_infinite]"></div>
               <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 rounded-full blur-md"></div>
               <svg className="w-8 h-8 text-white fill-white ml-2 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
          
          <h1 className="text-4xl font-black text-white tracking-wide mb-2 uppercase font-['Outfit']">
            CINEXA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-zinc-400">
            <span className="h-[1px] w-8 bg-zinc-700"></span>
            <p className="text-sm tracking-widest uppercase">Criando o futuro visual</p>
            <span className="h-[1px] w-8 bg-zinc-700"></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide ml-1">Nome</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full rounded-xl p-3 text-white focus:outline-none"
                placeholder="Seu nome"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide ml-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full rounded-xl p-3 text-white focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wide ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full rounded-xl p-3 text-white focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">{error}</div>}

          <Button type="submit" className="w-full py-3.5 text-lg mt-4" isLoading={isLoading}>
            {isLogin ? 'Entrar na Plataforma' : 'Criar Conta Gratuita'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-zinc-400 hover:text-white text-sm transition-colors border-b border-zinc-700 hover:border-white pb-0.5"
          >
            {isLogin ? 'Não tem conta? Crie agora' : 'Já tem conta? Faça login'}
          </button>
        </div>
        
        {/* Demo Helper */}
        <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-zinc-600 text-center font-mono">
            <p>Admin: joaodasilvangola03@gmail.com / Netinho29</p>
        </div>
      </div>
    </div>
  );
};