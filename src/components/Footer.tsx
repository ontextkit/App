// src/components/Footer.tsx
import { useState } from 'react';

export function Footer() {
  const [iconError, setIconError] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <footer className="footer">
      <div className="footer-links">
        {/* Telegram */}
        <a 
          href="https://t.me/contexkit" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
          aria-label="Наш Telegram-канал"
        >
          {!iconError ? (
            <img 
              src={`${baseUrl}vector.svg`}
              alt="Telegram" 
              className="footer-icon"
              onError={() => setIconError(true)}
            />
          ) : (
            <span className="footer-icon-fallback">TG</span>
          )}
        </a>
        
        {/* GitHub */}
        <a 
          href="https://github.com/ontextkit/App" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
          aria-label="Наш репозиторий на GitHub"
        >
          <img 
            src={`${baseUrl}GitHub.svg`}
            alt="GitHub" 
            className="footer-icon"
          />
        </a>
      </div>
      
      <p className="footer-copyright">
        ContextKit © {new Date().getFullYear()}
      </p>
    </footer>
  );
}