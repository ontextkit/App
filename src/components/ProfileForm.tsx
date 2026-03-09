// src/components/ProfileForm.tsx
import { useState, useEffect } from 'react';
import type { LifeProfile, PromptPreset } from '../types';
import { PRESET_LABELS } from '../types';
import { buildPrompt } from '../utils/promptBuilder';

interface Props {
  profile: LifeProfile;
  onUpdate: (updated: LifeProfile) => void;
}

export function ProfileForm({ profile, onUpdate }: Props) {
  const [narrative, setNarrative] = useState(profile.narrative);
  const [preset, setPreset] = useState<PromptPreset>('coach');

  // 🔹 Синхронизация нарратива при смене профиля
  useEffect(() => {
    setNarrative(profile.narrative);
  }, [profile.id]);

  const handleSave = () => {
    onUpdate({ 
      ...profile, 
      narrative, 
      updatedAt: new Date().toISOString() 
    });
    alert('✅ Профиль сохранён!');
  };

  const handleGeneratePrompt = () => {
    const prompt = buildPrompt(profile, preset);
    navigator.clipboard.writeText(prompt).then(() => {
      alert('✅ Промт скопирован! Вставь в чат с ИИ.');
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('✅ Промт скопирован (fallback)!');
    });
  };

  // 🔹 ЭКСПОРТ ПРОФИЛЯ (новое)
  const handleExportProfile = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contextkit-${profile.domain}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card" style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* 🔹 ПРЕДУПРЕЖДЕНИЕ О LOCALSTORAGE (новое) */}
      <div style={{ 
        background: '#fff3cd', 
        border: '1px solid #ffc107', 
        borderRadius: '8px', 
        padding: '1rem', 
        fontSize: '0.875rem', 
        color: '#856404',
        marginBottom: '1.5rem'
      }}>
        🔒 <strong>Важно:</strong> Все данные хранятся только в этом браузере. 
        Если ты очистишь кэш или сменишь устройство — профили пропадут.
        <br />
        <button 
          onClick={handleExportProfile} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#856404', 
            textDecoration: 'underline', 
            cursor: 'pointer', 
            padding: 0, 
            font: 'inherit',
            fontWeight: 600,
            marginTop: '0.5rem'
          }}
        >
          💾 Скачать резервную копию профиля
        </button>
      </div>

      {/* Заголовок профиля */}
      <h2 className="mb-2" style={{ fontSize: '1.25rem', textAlign: 'center' }}>
        {profile.name}
      </h2>
      
      {/* Поле редактирования нарратива */}
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <strong>✏️ Твой цифровой портрет:</strong>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
          Отредактируй текст — это то, что увидит ИИ. Пиши как для друга: живо и конкретно.
        </p>
        <textarea
          className="textarea"
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          rows={8}
          style={{ minHeight: '180px' }}
        />
      </label>

      {/* Кнопка сохранения */}
      <button
        className="btn"
        onClick={handleSave}
        style={{ 
          width: '100%', 
          padding: '0.875rem', 
          fontSize: '15px',
          background: '#007bff'
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#007bff')}
      >
        💾 Сохранить изменения
      </button>

      {/* Разделитель */}
      <div style={{ margin: '1.5rem 0', borderTop: '2px dashed #eee' }} />

      {/* Секция генерации промта */}
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <strong>🎭 Роль ИИ:</strong>
        </label>
        
        <select
          className="select mb-2"
          value={preset}
          onChange={(e) => setPreset(e.target.value as PromptPreset)}
        >
          {Object.entries(PRESET_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <button
          className="btn"
          onClick={handleGeneratePrompt}
          style={{ 
            width: '100%', 
            padding: '0.875rem', 
            fontSize: '15px',
            background: '#6366f1'
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#4f46e5')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#6366f1')}
        >
          ✨ Сгенерировать и скопировать промт
        </button>
      </div>

      {/* 🔹 КНОПКА ЭКСПОРТА (новое) */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
        <button
          onClick={handleExportProfile}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '0.75rem', fontSize: '14px' }}
        >
          💾 Экспортировать профиль (.json)
        </button>
      </div>
    </div>
  );
}