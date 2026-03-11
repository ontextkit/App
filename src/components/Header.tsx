// src/components/Header.tsx
import { useState } from 'react';
import logo from '../assets/logo.svg';  // ← ← ← ИМПОРТ ИЗ ASSETS

export function Header() {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        {/* 🔹 Логотип */}
        <div className="logo-wrapper">
          {!logoError ? (
            <img
              src={logo}  // ← ← ← ПЕРЕМЕННАЯ, не строка!
              alt="ContextKit"
              className="logo"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="logo-fallback">📦</div>
          )}
        </div>

        {/* 🔹 Заголовок + слоган */}
        <div className="title-wrapper">
          <h1 className="main-title">ContextKit</h1>
          <p className="subtitle">Больше никогда не объясняй ИИ, кто ты</p>
        </div>
      </div>
    </header>
  );
}