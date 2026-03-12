// src/utils/projectExport.ts
import type { Project } from '../types';

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