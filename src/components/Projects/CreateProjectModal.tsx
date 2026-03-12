// src/components/Projects/CreateProjectModal.tsx
import { useState } from 'react';
import type { Project, ProjectType } from '../../types';
import { PROJECT_TYPE_LABELS } from '../../types';

interface Props {
  onClose: () => void;
  onCreate: (project: Project) => void;
}

// 🔹 Шаблоны проектов (добавлено)
const TEMPLATES = [
  {
    id: 'personal-brand',
    title: 'Личный бренд эксперта',
    description: 'Контент-план, посты, статьи для продвижения личного бренда',
    type: 'personal-brand' as ProjectType
  },
  {
    id: 'course-content',
    title: 'Онлайн-курс',
    description: 'Структура курса, уроки, задания для студентов',
    type: 'education' as ProjectType
  },
  {
    id: 'social-media',
    title: 'Соцсети (Instagram/Telegram)',
    description: 'Посты, сторис, сценарии для коротких видео',
    type: 'social-media' as ProjectType
  }
];

export function CreateProjectModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectType>('personal-brand');
  const [nameError, setNameError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setNameError(true);
      return;
    }
    
    setNameError(false);

    const newProject: Project = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      status: 'active',
      metaPrompts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreate(newProject);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Новый проект</h2>
          <button className="modal-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* 🔹 Поле названия */}
          <div className="form-group">
            <label htmlFor="title" className="form-label required">
              Название проекта
            </label>
            <input
              id="title"
              type="text"
              className={`form-input ${nameError ? 'input-error' : ''}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setNameError(false);
              }}
              placeholder="Например: Личный бренд эксперта по пиву"
              autoFocus
            />
            {nameError && (
              <span className="field-error">
                Введите название проекта
              </span>
            )}
          </div>

          {/* 🔹 Поле описания */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Описание (необязательно)
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание проекта..."
              rows={3}
            />
          </div>

          {/* 🔹 Выбор типа проекта */}
          <div className="form-group">
            <label className="form-label">Тип проекта</label>
            <div className="project-type-grid">
              {(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[]).map((projectType) => (
                <button
                  key={projectType}
                  type="button"
                  className={`project-type-option ${type === projectType ? 'selected' : ''}`}
                  onClick={() => setType(projectType)}
                >
                  {PROJECT_TYPE_LABELS[projectType]}
                </button>
              ))}
            </div>
          </div>

          {/* 🔹 ШАБЛОНЫ ПРОЕКТОВ — ВСТАВЛЕНО ЗДЕСЬ (после типа проекта, перед кнопками) */}
          <div className="template-grid">
            <h3 className="template-title">Или выберите шаблон:</h3>
            <div className="template-cards">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className="template-card"
                  onClick={() => {
                    setTitle(template.title);
                    setDescription(template.description);
                    setType(template.type);
                  }}
                >
                  <h4>{template.title}</h4>
                  <p>{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 🔹 Кнопки действий */}
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Создать проект
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}