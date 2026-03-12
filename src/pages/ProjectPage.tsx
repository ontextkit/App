// src/pages/ProjectPage.tsx
import { useState } from 'react';
import type { Project, MetaPrompt } from '../types';
import { KuskWizard } from '../components/KuskWizard/KuskWizard';
import { PROJECT_TYPE_LABELS } from '../types';
import { Modal } from '../components/common/Modal';
import { OpenInAI } from '../components/common/OpenInAI';
import { trackEvent } from '../utils/analytics';

interface Props {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onBack: () => void;
}

function formatPromptPreview(text: string, maxLength: number = 300): string {
  const truncated = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  return truncated
    .replace(/КОНТЕКСТ/, '\nКОНТЕКСТ')
    .replace(/УТОЧНЕНИЕ/, '\nУТОЧНЕНИЕ')
    .replace(/СОЗДАНИЕ/, '\nСОЗДАНИЕ')
    .replace(/КРИТИКА/, '\nКРИТИКА')
    .replace(/ИНСТРУКЦИЯ/, '\nИНСТРУКЦИЯ')
    .replace(/ФОРМАТ ОТВЕТА/, '\nФОРМАТ ОТВЕТА');
}

export function ProjectPage({ project, onUpdateProject, onBack }: Props) {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<MetaPrompt | null>(null);
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleSaveMetaPrompt = (metaPrompt: MetaPrompt) => {
    const updatedProject: Project = {
      ...project,
      metaPrompts: [...project.metaPrompts, metaPrompt],
      updatedAt: new Date().toISOString()
    };
    onUpdateProject(updatedProject);
    setShowWizard(false);
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    trackEvent('meta_prompt_copied');
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handleDeleteMetaPrompt = (promptId: string) => {
    const updatedProject: Project = {
      ...project,
      metaPrompts: project.metaPrompts.filter((p: MetaPrompt) => p.id !== promptId),
      updatedAt: new Date().toISOString()
    };
    onUpdateProject(updatedProject);
    setDeletePromptId(null);
  };

  if (showWizard) {
    return (
      <KuskWizard
        projectId={project.id}
        onSave={handleSaveMetaPrompt}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  const typeLabel = PROJECT_TYPE_LABELS[project.type];

  return (
    <div className="project-page">
      <div className="project-page-header">
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          Назад
        </button>
        
        <div className="project-page-title">
          <h1 className="project-page-main-title">{project.title}</h1>
          <span className="project-page-type">{typeLabel}</span>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => setShowWizard(true)}
        >
          Создать мета-промпт
        </button>
      </div>

      {project.description && (
        <div className="project-description-card">
          <h3>О проекте</h3>
          <p>{project.description}</p>
        </div>
      )}

      <div className="meta-prompts-section">
        <h2>Мета-промпты ({project.metaPrompts.length})</h2>
        
        {project.metaPrompts.length === 0 ? (
          <div className="empty-prompts">
            <p>В этом проекте пока нет мета-промтов</p>
          </div>
        ) : (
          <div className="meta-prompts-list">
            {project.metaPrompts.map((prompt: MetaPrompt) => (
              <div key={prompt.id} className="meta-prompt-card">
                <div className="meta-prompt-header">
                  <h3>{prompt.title}</h3>
                  <span className={`meta-prompt-status status-${prompt.status}`}>
                    {prompt.status === 'draft' && 'Черновик'}
                    {prompt.status === 'ready' && 'Готов'}
                    {prompt.status === 'used' && 'Использован'}
                  </span>
                </div>
                
                <div className="meta-prompt-info">
                  <span>Создан: {new Date(prompt.createdAt).toLocaleDateString('ru-RU')}</span>
                  <span>Итераций: {prompt.iterations}</span>
                </div>

                <div className="meta-prompt-preview">
                  <pre>{formatPromptPreview(prompt.generatedPrompt)}</pre>
                </div>

                <div className="meta-prompt-actions">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedPrompt(prompt)}
                  >
                    Просмотр
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleCopyPrompt(prompt.generatedPrompt)}
                  >
                    Копировать
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeletePromptId(prompt.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно просмотра промпта */}
      {selectedPrompt && (
        <div className="modal-overlay" onClick={() => setSelectedPrompt(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedPrompt.title}</h2>
              <button className="modal-close" onClick={() => setSelectedPrompt(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <pre className="full-prompt-preview">{selectedPrompt.generatedPrompt}</pre>
              
              {/* Кнопки открытия в ИИ */}
              <OpenInAI prompt={selectedPrompt.generatedPrompt} />
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedPrompt(null)}
              >
                Закрыть
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  handleCopyPrompt(selectedPrompt.generatedPrompt);
                  setSelectedPrompt(null);
                }}
              >
                Копировать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модал подтверждения удаления */}
      <Modal
        isOpen={deletePromptId !== null}
        onClose={() => setDeletePromptId(null)}
        title="Удалить мета-промпт?"
        message="Это действие нельзя отменить. Мета-промпт будет удалён из проекта."
        onConfirm={() => deletePromptId && handleDeleteMetaPrompt(deletePromptId)}
        confirmText="Удалить"
        cancelText="Отмена"
        type="danger"
      />

      {/* Toast-уведомление о копировании */}
      {showCopyToast && (
        <div className="toast toast-success">
          Скопировано в буфер обмена
        </div>
      )}
    </div>
  );
}