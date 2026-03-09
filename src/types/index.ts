// src/types/index.ts

// 📋 Домены жизни (сферы)
export type LifeDomain = 
  | 'work' 
  | 'finance' 
  | 'family' 
  | 'health' 
  | 'hobby' 
  | 'study' 
  | 'personal' 
  | 'custom';

// 🏷 Названия доменов для UI
export const DOMAIN_LABELS: Record<LifeDomain, string> = {
  work: '💼 Работа',
  finance: '💰 Финансы',
  family: '👨‍👩‍👧 Семья',
  health: '🧘 Здоровье',
  hobby: '🎨 Хобби',
  study: '📚 Учёба',
  personal: '👤 Личное',
  custom: '✨ Своя сфера'
};

// 📋 Профиль жизни
export interface LifeProfile {
  id: string;                    // Уникальный ID (uuid)
  name: string;                  // Название (например, "Работа в стартапе")
  domain: LifeDomain;            // Сфера жизни
  
  // 📝 Ответы на опросник (сырые данные)
  questionnaireAnswers: {
    question1: string;  // "Что для вас важно в этой сфере?"
    question2: string;  // "Какие решения вы обычно принимаете?"
    question3: string;  // "Что вас беспокоит?"
    question4: string;  // "Что вас вдохновляет?"
    question5: string;  // "Какая ваша главная цель?"
  };
  
  // 📖 Нарратив (отредактированный портрет)
  narrative: string;
  
  // 🕐 Метаданные
  createdAt: string;            // ISO date
  updatedAt: string;            // ISO date
}

// 🎭 Роль ИИ для генерации промта
export type PromptPreset = 'coach' | 'editor' | 'analyst' | 'friend';

export const PRESET_LABELS: Record<PromptPreset, string> = {
  coach: "🎯 Коуч: помощь в достижении целей",
  editor: "✍️ Редактор: правка текстов и стиля",
  analyst: "📊 Аналитик: разбор данных и выводов",
  friend: "💬 Друг: неформальный диалог"
};