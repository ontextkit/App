// src/components/Header.tsx
import { useState, useEffect } from 'react';

interface Props {
  onLogoClick?: () => void;
}

export function Header({ onLogoClick }: Props) {
  const [logoError, setLogoError] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  // 🔹 Загрузка темы при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved === 'dark' || (saved === null && prefersDark);
    setIsDark(initial);
    document.documentElement.setAttribute('data-theme', initial ? 'dark' : 'light');
  }, []);

  // 🔹 Переключение темы
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

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
                <span className="logo-fallback-text">CK</span>
              </div>
            )}
          </div>

          <div className="title-wrapper">
            <h1 className="main-title">ContextKit</h1>
            <p className="subtitle">Больше никогда не объясняй ИИ, кто ты</p>
          </div>
        </button>

        {/* 🔹 Переключатель темы */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
          type="button"
        >
          <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </header>
  );
}