// src/pages/LandingPage.tsx
import { useState } from 'react';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="landing-page">
      {/* Герой-секция */}
      <section className="landing-hero">
        <h1 className="landing-title">
          ContextKit
        </h1>
        <p className="landing-subtitle">
          Больше никогда не объясняй ИИ, кто ты
        </p>
        <p className="landing-description">
          Персональный промпт-инженер для контент-мейкеров. 
          Сохраняйте свой контекст, методологию и подход — 
          получайте от ИИ ответы, которые звучат как вы.
        </p>
        <div className="landing-actions">
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            Начать бесплатно
          </button>
          <button 
            className="btn btn-secondary btn-lg" 
            onClick={() => setShowInstructions(!showInstructions)}
          >
            Как это работает?
          </button>
        </div>
      </section>

      {/* 🔹 Серые блоки-заглушки для эстетики */}
      <section className="placeholder-grid">
        <div className="placeholder-card">
          <h4>📁 У вас нет проектов</h4>
          <p>Создайте первый прямо сейчас</p>
        </div>
        <div className="placeholder-card">
          <h4>✨ Создайте новый проект!</h4>
          <p>Нажмите на карточку с плюсом</p>
        </div>
        <div className="placeholder-card">
          <h4>🧩 Мета-промпты</h4>
          <p>Готовые шаблоны для ИИ</p>
        </div>
      </section>

      {/* Инструкция (раскрывается) */}
      {showInstructions && (
        <section className="landing-instructions">
          <h2>Как работает ContextKit</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Создайте проект</h3>
              <p>Опишите задачу: пост, сценарий, план контента</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Заполните КУСК</h3>
              <p>Контекст → Уточнение → Создание → Критика</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Получите мета-промпт</h3>
              <p>Готовый промпт для вставки в любой ИИ</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Откройте в ИИ</h3>
              <p>Один клик — и промпт в ChatGPT, Claude или Perplexity</p>
            </div>
          </div>
        </section>
      )}

      {/* Что такое мета-промпт */}
      <section className="landing-info">
        <h2>Что такое мета-промпт?</h2>
        <div className="info-card">
          <p>
            <strong>Мета-промпт</strong> — это промпт для создания промптов. 
            Он содержит весь ваш контекст: методологию, аудиторию, тон, 
            ограничения и критерии успеха.
          </p>
          <div className="comparison">
            <div className="comparison-item">
              <h4>❌ Обычный промпт</h4>
              <p>«Напиши пост о продукте»</p>
              <p>→ Generic-ответ, нужно переписывать</p>
            </div>
            <div className="comparison-item">
              <h4>✅ Мета-промпт ContextKit</h4>
              <p>«Ты — мой помощник. Я использую методику X для аудитории Y. 
              Тон: профессиональный с элементами юмора. Формат: пост до 500 знаков...»</p>
              <p>→ Персонализированный ответ, готов к публикации</p>
            </div>
          </div>
        </div>
      </section>

      {/* Возможные проблемы */}
      <section className="landing-faq">
        <h2>Возможные проблемы и решения</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h4>«Не знаю, что писать в Контексте»</h4>
            <p>Используйте подсказки в визарде. Начните с методологии и аудитории — остальное можно заполнить позже.</p>
          </div>
          <div className="faq-item">
            <h4>«Промпт слишком длинный»</h4>
            <p>Это нормально. Мета-промпт содержит весь контекст. ИИ справляется с длинными промптами лучше, чем с короткими без контекста.</p>
          </div>
          <div className="faq-item">
            <h4>«Данные хранятся локально. Что если очищу кэш?»</h4>
            <p>Используйте экспорт в JSON (кнопка в настройках проекта). В будущем добавим облачную синхронизацию.</p>
          </div>
        </div>
      </section>

      {/* Футер лендинга */}
      <section className="landing-footer">
  <div className="team-info">
    <h3>Разработано для StartUp 2026</h3>
    <p>Контекст — только ваш. Никаких серверов, никакой передачи данных.</p>
  </div>
  {/* 🔹 Иконки убраны — они теперь только в общем футере */}
</section>
    </div>
  );
}