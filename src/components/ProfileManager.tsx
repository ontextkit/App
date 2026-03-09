// src/components/ProfileManager.tsx
import { useState } from 'react';
import type { LifeProfile } from '../types';
import { DOMAIN_LABELS } from '../types';

interface Props {
  profiles: LifeProfile[];
  activeProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onCreateProfile: () => void;
  onDeleteProfile: (id: string) => void;
  onImportProfile: (profile: LifeProfile) => void;
  onExportAll: () => void;
}

export function ProfileManager({ 
  profiles, 
  activeProfileId, 
  onSelectProfile, 
  onCreateProfile, 
  onDeleteProfile,
  onImportProfile,
  onExportAll
}: Props) {

  // 🔹 Стейт для кастомного подтверждения удаления
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleImportProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          imported.forEach((profile: LifeProfile) => {
            if (profile.id && profile.domain && profile.narrative) {
              onImportProfile(profile);
            }
          });
          alert(`✅ Импортировано профилей: ${imported.length}`);
        } else if (imported.id && imported.domain && imported.narrative) {
          onImportProfile(imported);
          alert('✅ Профиль импортирован!');
        } else {
          alert('❌ Неверный формат файла');
        }
      } catch {
        alert('❌ Не удалось прочитать файл');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 🔹 Обработчик подтверждения удаления
  const handleConfirmDelete = (id: string) => {
    onDeleteProfile(id);
    setDeleteConfirmId(null);
  };

  return (
    // ✅ position: relative для позиционирования модального окна
    <div className="mb-3" style={{ position: 'relative' }}>
      
      {/* Заголовок + кнопки */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <h2 className="mb-0" style={{ fontSize: '1.25rem' }}>📁 Ваши профили</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={onExportAll}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '14px' }}
            disabled={profiles.length === 0}
          >
            📦 Экспортировать всё
          </button>
          
          <label className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '14px', cursor: 'pointer' }}>
            📥 Импорт
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportProfile} 
              style={{ display: 'none' }} 
            />
          </label>
          
          <button
            onClick={onCreateProfile}
            className="btn"
            style={{ padding: '0.5rem 1rem', fontSize: '14px' }}
          >
            + Новый профиль
          </button>
        </div>
      </div>

      {/* Пустое состояние */}
      {profiles.length === 0 ? (
        <p className="text-center" style={{ color: '#666', fontStyle: 'italic', padding: '2rem' }}>
          У вас пока нет профилей. Создайте первый или импортируйте из файла!
        </p>
      ) : (
        /* Список профилей */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {profiles.map((profile) => {
            const isActive = activeProfileId === profile.id;
            const isConfirmingDelete = deleteConfirmId === profile.id;
            
            return (
              <div
                key={profile.id}
                onClick={() => onSelectProfile(profile.id)}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: `2px solid ${isActive ? '#6366f1' : '#eee'}`,
                  background: isActive ? '#f0f0ff' : '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>
                    {DOMAIN_LABELS[profile.domain]}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {profile.name}
                  </div>
                </div>

                {/* 🔹 Кнопка или подтверждение удаления */}
                <div>
                  {isConfirmingDelete ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmDelete(profile.id);
                        }}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '12px' }}
                      >
                          Да
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(null);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '12px' }}
                      >
                        ✕ Нет
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(profile.id);
                      }}
                      className="btn btn-danger"
                      style={{ padding: '0.375rem 0.75rem', fontSize: '13px' }}
                    >
                      🗑 Удалить
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔹 Модальное окно подтверждения (работает в PWA!) */}
      {deleteConfirmId && (
        <>
          {/* Затемнение фона */}
          <div 
            onClick={() => setDeleteConfirmId(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 9998
            }}
          />
          
          {/* Само модальное окно */}
          <div 
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              zIndex: 9999,
              maxWidth: '320px',
              width: '90%',
              textAlign: 'center',
              border: '2px solid #e5e7eb'
            }}
          >
            <p style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 500, color: '#1f2937' }}>
                Удалить этот профиль?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => handleConfirmDelete(deleteConfirmId)}
                className="btn btn-danger"
                style={{ flex: 1, padding: '0.75rem', fontSize: '14px' }}
              >
                Удалить
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem', fontSize: '14px' }}
              >
                Отмена
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}