export interface UserProfile {
  goals: string;    // 🎯 Цели
  work: string;     // 💼 Работа/контекст  
  style: string;    // 🧠 Стиль общения
}

export type PromptPreset = 'coach' | 'editor' | 'analyst' | 'friend';