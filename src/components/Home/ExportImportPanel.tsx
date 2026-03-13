// src/components/Home/ExportImportPanel.tsx
import { useState } from 'react';
import type { Project } from '../../types';
import { 
  exportProjectsToJSON, 
  downloadJSON, 
  importProjectsFromJSON,
  exportProjectsToMarkdown,
  downloadMarkdown
} from '../../utils/projectExport';
import { Modal } from '../common/Modal';

interface Props {
  projects: Project[];
  onImportProjects: (projects: Project[]) => void;
}

type ExportMode = 'all' | 'selected' | null;
type ExportFormat = 'json' | 'markdown' | null;

export function ExportImportPanel({ projects, onImportProjects }: Props) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set());
  const [exportMode, setExportMode] = useState<ExportMode>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(null);

  const handleExport = () => {
    if (projects.length === 0) return;
    setShowExportModal(true);
  };

  const confirmExport = () => {
    const projectsToExport = exportMode === 'all' 
      ? projects 
      : projects.filter(p => selectedProjectIds.has(p.id));
    
    if (projectsToExport.length === 0) {
      alert('Выберите хотя бы один проект для экспорта');
      return;
    }
    
    const dateStr = new Date().toISOString().split('T')[0];
    
    if (exportFormat === 'markdown') {
      const md = exportProjectsToMarkdown(projectsToExport);
      downloadMarkdown(`contextkit-export-${dateStr}.md`, md);
    } else {
      const json = exportProjectsToJSON(projectsToExport);
      downloadJSON(`contextkit-export-${dateStr}.json`, json);
    }
    
    setShowExportModal(false);
    setExportMode(null);
    setExportFormat(null);
    setSelectedProjectIds(new Set());
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = importProjectsFromJSON(e.target?.result as string);
        onImportProjects(imported);
      } catch {
        alert('Ошибка импорта: неверный формат файла');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const toggleProjectSelection = (projectId: string) => {
    const newSet = new Set(selectedProjectIds);
    if (newSet.has(projectId)) {
      newSet.delete(projectId);
    } else {
      newSet.add(projectId);
    }
    setSelectedProjectIds(newSet);
  };

  const selectAll = () => {
    setSelectedProjectIds(new Set(projects.map(p => p.id)));
  };

  const deselectAll = () => {
    setSelectedProjectIds(new Set());
  };

  return (
    <>
      <div className="export-import-panel">
        <button 
          className="btn-export" 
          onClick={handleExport}
          disabled={projects.length === 0}
        >
          Экспорт данных
        </button>
        <label className="btn-import">
          Импорт данных
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Модальное окно экспорта */}
      {/* Модальное окно экспорта */}
<Modal
  isOpen={showExportModal}
  onClose={() => {
    setShowExportModal(false);
    setExportMode(null);
    setSelectedProjectIds(new Set());
  }}
  title="Экспорт проектов"
  message={projects.length === 0 ? "У вас пока нет проектов для экспорта" : "Выберите способ экспорта:"}
  onConfirm={confirmExport}
  confirmText="Экспортировать"
  cancelText="Отмена"
>
  {/* 🔹 Children передаются между открывающим и закрывающим тегом Modal */}
  {projects.length > 0 && (
    <div className="export-options">
      {/* Формат экспорта */}
      <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border-light)' }}>
        <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: 'var(--text-sm)' }}>Формат:</strong>
        <label className="export-option" style={{ marginBottom: '0.5rem' }}>
          <input
            type="radio"
            name="exportFormat"
            checked={exportFormat === 'json'}
            onChange={() => setExportFormat('json')}
          />
          <span>JSON (для импорта обратно)</span>
        </label>
        <label className="export-option">
          <input
            type="radio"
            name="exportFormat"
            checked={exportFormat === 'markdown'}
            onChange={() => setExportFormat('markdown')}
          />
          <span>Markdown (для чтения и публикации)</span>
        </label>
      </div>

      {/* Режим: все проекты */}
      <label className="export-option">
        <input
          type="radio"
          name="exportMode"
          checked={exportMode === 'all'}
          onChange={() => setExportMode('all')}
        />
        <span>Все проекты ({projects.length})</span>
      </label>

      {/* Режим: выбор проектов */}
      <label className="export-option">
        <input
          type="radio"
          name="exportMode"
          checked={exportMode === 'selected'}
          onChange={() => setExportMode('selected')}
        />
        <span>Выбрать проекты</span>
      </label>

      {/* Список для выбора */}
      {exportMode === 'selected' && (
        <div className="project-selection-list">
          <div className="selection-actions">
            <button type="button" className="btn-text" onClick={selectAll}>
              Выбрать все
            </button>
            <button type="button" className="btn-text" onClick={deselectAll}>
              Снять выделение
            </button>
          </div>
          <div className="selection-list">
            {projects.map((project) => (
              <label key={project.id} className="selection-item">
                <input
                  type="checkbox"
                  checked={selectedProjectIds.has(project.id)}
                  onChange={() => toggleProjectSelection(project.id)}
                />
                <span className="selection-title">{project.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</Modal>
    </>
  );
}