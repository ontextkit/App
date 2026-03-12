// src/types/index.ts

// ============================================================================
// 🔹 ОСНОВНЫЕ ТИПЫ ПРОЕКТОВ
// ============================================================================

/**
 * Тип проекта — определяет шаблон и структуру мета-промтов
 */
export type ProjectType =
  | 'personal-brand'      // Личный бренд эксперта
  | 'content-strategy'    // Контент-стратегия
  | 'video-scripts'       // Сценарии для видео
  | 'social-media'        // Посты для соцсетей
  | 'email-marketing'     // Email-рассылки
  | 'custom';             // Свой шаблон

/**
 * Статус проекта
 */
export type ProjectStatus =
  | 'active'    // В работе
  | 'archived'  // Архивирован
  | 'draft';    // Черновик

/**
 * Проект — контейнер для мета-промтов
 */
export interface Project {
  id: string;
  title: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  color?: string;           // Цвет карточки (hex)
  metaPrompts: MetaPrompt[]; // Мета-промпты внутри проекта
  createdAt: string;        // ISO date
  updatedAt: string;        // ISO date
}

// ============================================================================
// 🔹 ТИПЫ МЕТА-ПРОМПТОВ (КУСК фреймворк)
// ============================================================================

/**
 * Этапы фреймворка КУСК
 */
export type KuskStage =
  | 'context'    // Контекст
  | 'clarify'    // Уточнение
  | 'create'     // Создание
  | 'critique';  // Критика

/**
 * Формат выходного результата
 */
export type OutputFormat =
  | 'guide'      // Пошаговое руководство
  | 'plan'       // План / дорожная карта
  | 'script'     // Сценарий видео / поста
  | 'dialogue'   // Диалог с ИИ-тренером
  | 'brief'      // Бриф для команды
  | 'article'    // Статья / лонгрид
  | 'custom';    // Свой формат

/**
 * Тип источника контекста
 */
export type SourceType =
  | 'file'      // Загруженный файл (PDF, TXT, DOC)
  | 'url'       // Ссылка (YouTube, статья, сайт)
  | 'manual'    // Ручной ввод текста
  | 'profile';  // Профиль эксперта / методика

/**
 * Тон коммуникации
 */
export type ToneType =
  | 'professional'  // Профессиональный
  | 'casual'        // Дружеский
  | 'provocative'   // Провокационный
  | 'academic'      // Академический
  | 'custom';       // Свой вариант

/**
 * Статус мета-промпта
 */
export type MetaPromptStatus =
  | 'draft'   // Черновик
  | 'ready'   // Готов к использованию
  | 'used';   // Уже использовался в ИИ

/**
 * Мета-промпт — основная единица работы
 */
export interface MetaPrompt {
  id: string;
  projectId: string;        // Связь с проектом
  title: string;
  description?: string;
  
  // КУСК этапы
  context: ContextData;
  clarify: ClarifyData;
  create: CreateData;
  critique: CritiqueData;
  
  // Сгенерированный мета-промпт
  generatedPrompt: string;
  
  // Метаданные
  status: MetaPromptStatus;
  iterations: number;       // Количество улучшений
  lastUsedAt?: string;      // ISO date, когда последний раз использовали
  createdAt: string;        // ISO date
  updatedAt: string;        // ISO date
}

// ============================================================================
// 🔹 ДАННЫЕ ЭТАПОВ КУСК
// ============================================================================

/**
 * Контекст — что ИИ должен знать о пользователе
 */
export interface ContextData {
  sources: Source[];
  methodology: string;      // Методология / подход эксперта
  audience: string;         // Целевая аудитория
  tone: ToneType;
  customTone?: string;      // Если tone = 'custom'
}

/**
 * Источник информации
 */
export interface Source {
  id: string;
  type: SourceType;
  value: string;            // URL, путь к файлу или текст
  description: string;      // Описание источника
  addedAt: string;          // ISO date
}

/**
 * Уточнение — что именно нужно сделать
 */
export interface ClarifyData {
  goal: string;             // Конкретная цель
  constraints: string;      // Ограничения (время, бюджет, ресурсы)
  preferences: string;      // Предпочтения (формат, стиль, длина)
  questions: string[];      // Вопросы, которые ИИ должен задать
}

/**
 * Создание — какой результат нужен
 */
export interface CreateData {
  outputFormat: OutputFormat;
  customFormat?: string;    // Если outputFormat = 'custom'
  structure: string;        // Предпочтительная структура
  examples: string;         // Примеры желаемого результата
  successCriteria: string;  // Критерии качества
}

/**
 * Критика — что проверить и улучшить
 */
export interface CritiqueData {
  blindSpots: string;       // "Какие слепые зоны я мог упустить?"
  weaknesses: string;       // "Что слабо в этой аргументации?"
  alternatives: string;     // "Какие есть альтернативные подходы?"
  nextSteps: string;        // "Что делать после получения ответа?"
}

// ============================================================================
// 🔹 ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// ============================================================================

/**
 * Настройки приложения
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'ru' | 'en';
  defaultOutputFormat: OutputFormat;
  autoSave: boolean;
  exportFormat: 'json' | 'txt' | 'md';
}

/**
 * Данные для экспорта / импорта
 */
export interface ExportData {
  version: string;          // Версия формата экспорта
  exportedAt: string;       // ISO date
  projects: Project[];
  settings?: AppSettings;
}

/**
 * Результат генерации мета-промпта
 */
export interface GenerationResult {
  success: boolean;
  prompt: string;
  suggestions?: string[];   // Предложения по улучшению
  warnings?: string[];      // Предупреждения о неполных данных
}

// ============================================================================
// 🔹 КОНСТАНТЫ И МАППИНГИ ДЛЯ UI
// ============================================================================

/**
 * Названия типов проектов для UI
 */
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  'personal-brand': 'Личный бренд',
  'content-strategy': 'Контент-стратегия',
  'video-scripts': 'Сценарии для видео',
  'social-media': 'Посты для соцсетей',
  'email-marketing': 'Email-рассылки',
  'custom': 'Свой шаблон'
};

/**
 * Названия статусов проекта для UI
 */
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  'active': 'В работе',
  'archived': 'Архив',
  'draft': 'Черновик'
};

/**
 * Названия этапов КУСК для UI
 */
export const KUSK_STAGE_LABELS: Record<KuskStage, string> = {
  'context': 'Контекст',
  'clarify': 'Уточнение',
  'create': 'Создание',
  'critique': 'Критика'
};

/**
 * Названия форматов вывода для UI
 */
export const OUTPUT_FORMAT_LABELS: Record<OutputFormat, string> = {
  'guide': 'Пошаговое руководство',
  'plan': 'План / дорожная карта',
  'script': 'Сценарий видео / поста',
  'dialogue': 'Диалог с ИИ-тренером',
  'brief': 'Бриф для команды',
  'article': 'Статья / лонгрид',
  'custom': 'Свой формат'
};

/**
 * Названия типов источников для UI
 */
export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  'file': 'Файл',
  'url': 'Ссылка',
  'manual': 'Текст',
  'profile': 'Профиль эксперта'
};

/**
 * Названия тонов для UI
 */
export const TONE_LABELS: Record<ToneType, string> = {
  'professional': 'Профессиональный',
  'casual': 'Дружеский',
  'provocative': 'Провокационный',
  'academic': 'Академический',
  'custom': 'Свой вариант'
};

/**
 * Названия статусов мета-промпта для UI
 */
export const META_PROMPT_STATUS_LABELS: Record<MetaPromptStatus, string> = {
  'draft': 'Черновик',
  'ready': 'Готов',
  'used': 'Использован'
};

/**
 * Цвета по умолчанию для типов проектов
 */
export const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  'personal-brand': '#7b67a9',
  'content-strategy': '#5b8c9e',
  'video-scripts': '#9e5b8c',
  'social-media': '#8c9e5b',
  'email-marketing': '#5b9e8c',
  'custom': '#6e6e73'
};

// ============================================================================
// 🔹 УТИЛИТЫ ТИПОВ
// ============================================================================

/**
 * Получить все ключи типа
 */
export type KeysOfType<T> = keyof T;

/**
 * Получить все значения enum-подобного объекта
 */
export type ValuesOfType<T extends Record<string, string>> = T[keyof T];

/**
 * Частичный тип для обновления (все поля опциональны)
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Обязательные поля для создания проекта
 */
export type CreateProjectInput = Pick<Project, 'title' | 'type'> & 
  Partial<Pick<Project, 'description' | 'color'>>;

/**
 * Обязательные поля для создания мета-промпта
 */
export type CreateMetaPromptInput = Pick<MetaPrompt, 'projectId' | 'title'> &
  Partial<Pick<MetaPrompt, 'description'>>;