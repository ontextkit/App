// src/App.tsx
import { useState, useEffect } from 'react';
import type { LifeProfile } from './types';
import { ProfileManager } from './components/ProfileManager';
import { ProfileWizard } from './components/ProfileWizard';
import { ProfileForm } from './components/ProfileForm';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const STORAGE_KEY = 'contextkit_profiles';

function App() {
  const [profiles, setProfiles] = useState<LifeProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  // Загрузка из localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfiles(parsed);
        if (parsed.length > 0) {
          setActiveProfileId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse profiles', e);
      }
    }
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const handleCreateProfile = () => setShowWizard(true);

  const handleSaveProfile = (profile: LifeProfile) => {
    setProfiles(prev => [...prev, profile]);
    setActiveProfileId(profile.id);
    setShowWizard(false);
  };

  const handleDeleteProfile = (id: string) => {
  // ✅ Подтверждение теперь в ProfileManager (кастомное модальное окно)
  setProfiles(prev => {
    const filtered = prev.filter(p => p.id !== id);
    if (activeProfileId === id) {
      setActiveProfileId(filtered.length > 0 ? filtered[0].id : null);
    }
    return filtered;
  });
};

  const handleUpdateProfile = (updated: LifeProfile) => {
    setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // 🔹 ИМПОРТ ПРОФИЛЯ
  const handleImportProfile = (profile: LifeProfile) => {
    setProfiles(prev => {
      const exists = prev.some(p => p.id === profile.id);
      if (exists) {
        const newProfile = { ...profile, id: crypto.randomUUID() };
        return [...prev, newProfile];
      }
      return [...prev, profile];
    });
  };

  // 🔹 ЭКСПОРТ ВСЕХ ПРОФИЛЕЙ (новое)
  const handleExportAllProfiles = () => {
    const dataStr = JSON.stringify(profiles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contextkit-all-profiles-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  return (
  <div className="container">
    {/* 🔹 Логотип + заголовок через компонент */}
    <Header />
    
    <ProfileManager
      profiles={profiles}
      activeProfileId={activeProfileId}
      onSelectProfile={setActiveProfileId}
      onCreateProfile={handleCreateProfile}
      onDeleteProfile={handleDeleteProfile}
      onImportProfile={handleImportProfile}
      onExportAll={handleExportAllProfiles}
    />

    {showWizard ? (
      <ProfileWizard 
        onSave={handleSaveProfile} 
      />
    ) : activeProfile ? (
      <ProfileForm 
        profile={activeProfile} 
        onUpdate={handleUpdateProfile} 
      />
    ) : (
      <div className="empty-state">
        <p>Выберите профиль или создайте новый</p>
      </div>
    )}
    
    <Footer />
  </div>
);
}
export default App;