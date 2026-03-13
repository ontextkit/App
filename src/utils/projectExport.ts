// src/utils/projectExport.ts
import type { Project } from '../types';
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS } from '../types';

export function exportProjectsToJSON(projects: Project[]): string {
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    projects
  };
  return JSON.stringify(exportData, null, 2);
}

export function importProjectsFromJSON(jsonString: string): Project[] {
  const data = JSON.parse(jsonString);
  if (!data.projects || !Array.isArray(data.projects)) {
    throw new Error('Неверный формат файла');
  }
  return data.projects;
}

export function downloadJSON(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Экспорт проекта в формате Markdown
 */
export function exportProjectToMarkdown(project: Project): string {
  const lines: string[] = [];
  
  // Заголовок
  lines.push(`# ${project.title}`);
  lines.push('');
  
  // Описание
  if (project.description) {
    lines.push(`**Описание:** ${project.description}`);
    lines.push('');
  }
  
  // Мета-информация
  lines.push('## Информация');
  lines.push('');
  lines.push(`- **Тип:** ${PROJECT_TYPE_LABELS[project.type]}`);
  lines.push(`- **Статус:** ${PROJECT_STATUS_LABELS[project.status]}`);
  lines.push(`- **Создан:** ${new Date(project.createdAt).toLocaleDateString('ru-RU')}`);
  lines.push(`- **Обновлён:** ${new Date(project.updatedAt).toLocaleDateString('ru-RU')}`);
  lines.push('');
  
  // Мета-промпты
  lines.push('## Мета-промпты');
  lines.push('');
  
  if (project.metaPrompts.length === 0) {
    lines.push('*В этом проекте пока нет мета-промптов.*');
  } else {
    project.metaPrompts.forEach((prompt, index) => {
      lines.push(`### ${index + 1}. ${prompt.title}`);
      lines.push('');
      
      if (prompt.description) {
        lines.push(`**Описание:** ${prompt.description}`);
        lines.push('');
      }
      
      // КУСК этапы
      lines.push('#### КУСК Фреймворк');
      lines.push('');
      
      // Context
      lines.push('**Контекст:**');
      lines.push(`- Аудитория: ${prompt.context.audience}`);
      lines.push(`- Тон: ${prompt.context.tone}`);
      lines.push(`- Методология: ${prompt.context.methodology}`);
      lines.push('');
      
      // Clarify
      lines.push('**Уточнение:**');
      lines.push(`- Цель: ${prompt.clarify.goal}`);
      lines.push(`- Ограничения: ${prompt.clarify.constraints}`);
      lines.push('');
      
      // Create
      lines.push('**Создание:**');
      lines.push(`- Формат: ${prompt.create.outputFormat}`);
      lines.push(`- Структура: ${prompt.create.structure}`);
      lines.push('');
      
      // Critique
      lines.push('**Критика:**');
      lines.push(`- Слепые зоны: ${prompt.critique.blindSpots}`);
      lines.push(`- Следующие шаги: ${prompt.critique.nextSteps}`);
      lines.push('');
      
      // Сгенерированный промпт
      lines.push('#### Сгенерированный мета-промпт');
      lines.push('');
      lines.push('```');
      lines.push(prompt.generatedPrompt);
      lines.push('```');
      lines.push('');
      
      // Метаданные
      lines.push(`*Статус: ${prompt.status} | Итераций: ${prompt.iterations}*`);
      lines.push('');
      lines.push('---');
      lines.push('');
    });
  }
  
  return lines.join('\n');
}

/**
 * Экспорт нескольких проектов в один Markdown файл
 */
export function exportProjectsToMarkdown(projects: Project[]): string {
  if (projects.length === 1) {
    return exportProjectToMarkdown(projects[0]);
  }
  
  const lines: string[] = [];
  lines.push('# ContextKit — Экспорт проектов');
  lines.push('');
  lines.push(`**Дата экспорта:** ${new Date().toLocaleDateString('ru-RU')}`);
  lines.push(`**Количество проектов:** ${projects.length}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  
  projects.forEach((project) => {
    lines.push(exportProjectToMarkdown(project));
  });
  
  return lines.join('\n');
}

/**
 * Скачивание Markdown файла
 */
export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}