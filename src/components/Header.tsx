// src/components/Header.tsx
import { useState } from 'react';

interface Props {
  onLogoClick?: () => void;  // ← Новый пропс
}

export function Header({ onLogoClick }: Props) {  // ← Принимаем пропс
  const [logoError, setLogoError] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <header className="header">
      <div className="header-content">
        {/* 🔹 Логотип + заголовок теперь кликабельны */}
        <button 
          className="header-logo-btn" 
          onClick={onLogoClick}
          aria-label="Вернуться на главную"
          type="button"
        >
          <div className="logo-wrapper">
            {!logoError ? (
              <img
                src={`${baseUrl}logo.svg`}
                alt="ContextKit"
                className="logo"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="logo-fallback">
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7b67a9' }}>CK</span>
              </div>
            )}
          </div>

          <div className="title-wrapper">
            <h1 className="main-title">ContextKit</h1>
            <p className="subtitle">Больше никогда не объясняй ИИ, кто ты</p>
          </div>
        </button>
      </div>
    </header>
  );
}