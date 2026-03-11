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
    <div className="profile-manager mb-3" style={{ position: 'relative' }}>
      
      {/* Заголовок + кнопки */}
      <div className="profile-manager-header">
        <h2 className="profile-manager-title">Ваши профили</h2>
        <div className="profile-actions-top">
          <button
            onClick={onExportAll}
            className="btn btn-secondary btn-sm"
            disabled={profiles.length === 0}
          >
            📦 Экспорт всех
          </button>
          
          <label className="btn btn-secondary btn-sm file-input-label">
            📥 Импорт
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportProfile} 
              className="file-input"
            />
          </label>
          
          <button
            onClick={onCreateProfile}
            className="btn btn-create"
          >
            + Создать новый профиль
          </button>
        </div>
      </div>

      {/* Пустое состояние */}
      {profiles.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">
            У вас пока нет профилей. Создайте первый или импортируйте из файла!
          </p>
        </div>
      ) : (
        /* Список профилей */
        <ul className="profile-list">
          {profiles.map((profile) => {
            const isActive = activeProfileId === profile.id;
            const isConfirmingDelete = deleteConfirmId === profile.id;
            
            return (
              <li
                key={profile.id}
                onClick={() => onSelectProfile(profile.id)}
                className={`profile-item ${isActive ? 'active' : ''}`}
                style={{
                  // Динамические стили (зависят от стейта)
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                }}
              >
                <div className="profile-item-content">
                  <span className="profile-domain">{DOMAIN_LABELS[profile.domain]}</span>
                  <span className="profile-name">{profile.name}</span>
                </div>

                {/* 🔹 Кнопка или подтверждение удаления */}
                <div>
                  {isConfirmingDelete ? (
                    <div className="delete-confirm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmDelete(profile.id);
                        }}
                        className="btn btn-danger btn-xs"
                      >
                        ✅ Да
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(null);
                        }}
                        className="btn btn-secondary btn-xs"
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
                      className="btn btn-delete btn-xs"
                    >
                      🗑 Удалить
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* 🔹 Модальное окно подтверждения (работает в PWA!) */}
      {deleteConfirmId && (
        <>
          {/* Затемнение фона */}
          <div 
            className="modal-overlay"
            onClick={() => setDeleteConfirmId(null)}
          />
          
          {/* Само модальное окно */}
          <div className="modal">
            <p className="modal-text">🗑 Удалить этот профиль?</p>
            <div className="modal-actions">
              <button
                onClick={() => handleConfirmDelete(deleteConfirmId)}
                className="btn btn-danger"
              >
                Удалить
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-secondary"
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