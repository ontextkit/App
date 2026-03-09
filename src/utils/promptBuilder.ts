// src/utils/promptBuilder.ts

// 🔹 Типы — только для TypeScript
import type { LifeProfile, PromptPreset } from '../types';

// 🔹 Значения — для выполнения кода
import { PRESET_LABELS } from '../types';

/**
 * Генерирует персонализированный промт для ИИ на основе профиля и выбранной роли
 */
export function buildPrompt(profile: LifeProfile, preset: PromptPreset): string {
  const presetName = PRESET_LABELS[preset];

  return `Ты — мой персональный ИИ-ассистент в роли: ${presetName}

📋 КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ (сфера: ${profile.name}):
${profile.narrative}

✅ Подтверди, что принял контекст, и жди мой первый запрос.`;
}