// src/components/Footer.tsx
import { useState } from 'react';
import telegramIcon from '../assets/vector.svg';  // ← ← ← ИМПОРТ ИЗ ASSETS

export function Footer() {
  const [iconError, setIconError] = useState(false);

  return (
    <footer className="footer">
      <a 
        href="https://t.me/contexkit" 
        target="_blank" 
        rel="noopener noreferrer"
        className="telegram-link"
        aria-label="Наш Telegram-канал"
      >
        {!iconError ? (
          <img 
            src={telegramIcon}  // ← ← ← ПЕРЕМЕННАЯ, не строка!
            alt="Telegram" 
            className="telegram-icon"
            onError={() => setIconError(true)}
          />
        ) : (
          <span style={{ fontSize: '1.5rem', color: 'white' }}>✈️</span>
        )}
      </a>
    </footer>
  );
}