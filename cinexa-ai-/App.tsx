
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { GenerateVideo } from './pages/GenerateVideo';
import { GenerateImage } from './pages/GenerateImage';
import { GenerateThumbnail } from './pages/GenerateThumbnail';
import { Inspiration } from './pages/Inspiration';
import { History } from './pages/History';
import { Pricing } from './pages/Pricing';
import { AdminPanel } from './pages/AdminPanel';
import { Profile } from './pages/Profile';
import { User } from './types';
import { supabaseService } from '../services/supabaseService';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabaseService.auth.getSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const refreshUser = async () => {
    if (user) {
        const updatedUser = await supabaseService.db.getUser(user.id);
        if (updatedUser) setUser({...updatedUser});
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <HashRouter>
          <Layout user={user}>
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/video" element={<GenerateVideo user={user} refreshUser={refreshUser} />} />
              <Route path="/image" element={<GenerateImage user={user} refreshUser={refreshUser} />} />
              <Route path="/thumbnail" element={<GenerateThumbnail user={user} refreshUser={refreshUser} />} />
              <Route path="/inspiration" element={<Inspiration />} />
              <Route path="/history" element={<History user={user} />} />
              <Route path="/pricing" element={<Pricing user={user} />} />
              <Route path="/profile" element={<Profile user={user} refreshUser={refreshUser} />} />
              <Route path="/admin" element={user.isAdmin ? <AdminPanel user={user} /> : <Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
