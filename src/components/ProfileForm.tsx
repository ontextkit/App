import { useState } from 'react';
import type { UserProfile } from '../types';

interface Props {
  onSave: (profile: UserProfile) => void;
}

export function ProfileForm({ onSave }: Props) {
  const [profile, setProfile] = useState<UserProfile>({
    goals: '',
    work: '',
    style: '',
  });

  const handleChange = (field: keyof UserProfile) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProfile(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSave(profile); }} 
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}
    >
      <label>
        <strong>🎯 Мои цели:</strong>
        <textarea 
          value={profile.goals} 
          onChange={handleChange('goals')} 
          rows={3} 
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Запустить стартап до конца года"
        />
      </label>
      
      <label>
        <strong>💼 Работа/контекст:</strong>
        <textarea 
          value={profile.work} 
          onChange={handleChange('work')} 
          rows={3} 
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="CTO в стартапе, 5 лет в разработке"
        />
      </label>
      
      <label>
        <strong>🧠 Стиль ответов:</strong>
        <textarea 
          value={profile.style} 
          onChange={handleChange('style')} 
          rows={3} 
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          placeholder="Кратко, по делу, с примерами"
        />
      </label>
      
      <button 
        type="submit" 
        style={{ 
          padding: '0.75rem', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        💾 Сохранить профиль
      </button>
    </form>
  );
}