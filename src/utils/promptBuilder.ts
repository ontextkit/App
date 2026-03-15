// src/utils/promptBuilder.ts
import type { ContextData, ClarifyData, CreateData, CritiqueData } from '../types';

/**
 * Генерирует мета-промпт из данных КУСК
 */
export function buildMetaPrompt(data: {
  title: string;
  context: ContextData;
  clarify: ClarifyData;
  create: CreateData;
  critique: CritiqueData;
  description?: string;
}): string {
  const { context, clarify, create, critique } = data;

  // Форматируем источники
  const sourcesText = context.sources.length > 0
    ? context.sources.map(s => `• ${s.description}: ${s.value}`).join('\n')
    : '• Не указано';

  // Форматируем вопросы
  const questionsText = clarify.questions.length > 0 && clarify.questions.some(q => q.trim())
    ? `\n\nВопросы, которые ты должен мне задать:\n${clarify.questions.filter(q => q.trim()).map(q => `• ${q}`).join('\n')}`
    : '';

  // Форматируем примеры
  const examplesText = create.examples.trim()
    ? `\n\nПример желаемого результата:\n${create.examples}`
    : '';

  // Форматируем критику
  const critiqueParts = [
    critique.blindSpots.trim() && `Слепые зоны: ${critique.blindSpots}`,
    critique.weaknesses.trim() && `Слабые места: ${critique.weaknesses}`,
    critique.alternatives.trim() && `Альтернативные подходы: ${critique.alternatives}`,
    critique.nextSteps.trim() && `Следующие шаги: ${critique.nextSteps}`
  ].filter(Boolean);

  const critiqueText = critiqueParts.length > 0
    ? critiqueParts.join('\n')
    : '• Не указано';

  return `ТЫ — МОЙ ПЕРСОНАЛЬНЫЙ ПОМОЩНИК ПО ПРОМПТ-ИНЖЕНЕРИНГЕ.
Твоя задача: помочь мне создать максимально персонализированный и эффективный промпт для решения моей задачи.

📚 КОНТЕКСТ (что ты должен знать обо мне и моём подходе):
${sourcesText}
Методология: ${context.methodology || 'Не указана'}
Аудитория: ${context.audience || 'Не указана'}
Тон коммуникации: ${context.tone || 'Не указан'}

🎯 УТОЧНЕНИЕ (что именно я хочу сделать):
Цель: ${clarify.goal || 'Не указана'}
Ограничения: ${clarify.constraints || 'Нет'}
Предпочтения: ${clarify.preferences || 'Нет'}${questionsText}

🛠 СОЗДАНИЕ (какой результат мне нужен):
Формат: ${create.outputFormat || 'Не указан'}
Структура: ${create.structure || 'На твоё усмотрение'}${examplesText}
Критерии успеха: ${create.successCriteria || 'Качественный, персонализированный ответ'}

🔍 КРИТИКА (что проверить перед финальным ответом):
${critiqueText}

✅ ИНСТРУКЦИЯ ДЛЯ ТЕБЯ:
1. Проанализируй контекст и уточни, если чего-то не хватает.
2. Задай мне вопросы из раздела "Уточнение" (если они есть).
3. Сгенерируй промпт, который я смогу вставить в ИИ для решения моей задачи.
4. Предложи, как проверить качество результата (этап "Критика").
5. Будь конкретным, избегай общих фраз, опирайся на мой контекст.

📤 ФОРМАТ ОТВЕТА:
[Твой сгенерированный промпт для вставки в ИИ]

---
[Опционально: комментарии, рекомендации, вопросы для уточнения]`;
}

/**
 * Проверяет полноту данных КУСК
 */
export function validateKuskData(data: {
  context?: ContextData;
  clarify?: ClarifyData;
  create?: CreateData;
  critique?: CritiqueData;
}): {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
} {
  const missingFields: string[] = [];
  const warnings: string[] = [];

  // Контекст
  if (!data.context?.methodology?.trim()) {
    warnings.push('Методология не указана — ИИ может не понять ваш подход');
  }
  if (!data.context?.audience?.trim()) {
    warnings.push('Аудитория не указана — промпт будет менее персонализированным');
  }

  // Уточнение
  if (!data.clarify?.goal?.trim()) {
    missingFields.push('Цель не указана');
  }

  // Создание
  if (!data.create?.outputFormat) {
    missingFields.push('Формат вывода не выбран');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings
  };
}