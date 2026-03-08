import { useState, useEffect } from 'react';
import { ProfileForm } from './components/ProfileForm';
import type { UserProfile } from './types';

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Загрузка профиля при старте
  useEffect(() => {
    const saved = localStorage.getItem('contextkit_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка загрузки профиля:', e);
      }
    }
  }, []);

  // Сохранение профиля
  const handleSave = (newProfile: UserProfile) => {
    localStorage.setItem('contextkit_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  // Сброс профиля
  const handleReset = () => {
    localStorage.removeItem('contextkit_profile');
    setProfile(null);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#333', marginBottom: '1.5rem' }}>🚀 ContextKit</h1>
      
      {!profile ? (
        <>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Заполните профиль, чтобы получать персонализированные ответы от ИИ:
          </p>
          <ProfileForm onSave={handleSave} />
        </>
      ) : (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '1rem' }}>
            ✅ Профиль сохранён!
          </p>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>🎯 Цели:</strong>
            <p style={{ margin: '0.25rem 0', color: '#555' }}>{profile.goals || '—'}</p>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>💼 Контекст:</strong>
            <p style={{ margin: '0.25rem 0', color: '#555' }}>{profile.work || '—'}</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <strong>🧠 Стиль:</strong>
            <p style={{ margin: '0.25rem 0', color: '#555' }}>{profile.style || '—'}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleReset}
              style={{
                padding: '0.5rem 1rem',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✏️ Редактировать
            </button>
            <button 
              onClick={() => {
                // Здесь позже будет генерация промта
                alert('🔜 Скоро: генерация промта и копирование!');
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✨ Сгенерировать промт
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;