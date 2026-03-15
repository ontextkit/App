// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

console.log('🚀 main.tsx: starting');

const rootElement = document.getElementById('root');
console.log('🔍 root element:', rootElement);

if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Failed to find the root element #root');
}

console.log('✅ Root element found, mounting App');

// 🔹 TypeScript: после проверки !rootElement мы знаем, что это HTMLElement
// Используем не-null assertion operator (!) для createRoot
const root = createRoot(rootElement!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('✅ App rendered');