// src/components/Projects/ProjectCard.tsx
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_COLORS } from '../../types';
import type { Project } from '../../types';

interface Props {
  project: Project;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export function ProjectCard({ project, onClick, onDelete }: Props) {
  const timeAgo = getTimeAgo(project.updatedAt);
  const typeLabel = PROJECT_TYPE_LABELS[project.type];
  const defaultColor = PROJECT_TYPE_COLORS[project.type];
  const cardColor = project.color || defaultColor;

  return (
    <div 
      className="project-card" 
      onClick={onClick}
      style={{ backgroundColor: cardColor }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="card-content">
        <h3 className="project-title">{project.title}</h3>
        {project.description && (
          <p className="project-description">{project.description}</p>
        )}
        <span className="project-type">{typeLabel}</span>
      </div>
      
      <div className="card-footer">
        <span className="updated-time">Обновлено {timeAgo}</span>
        <span className="prompts-count">
          {project.metaPrompts.length} мета-промптов
        </span>
        {onDelete && (
          <button
            className="delete-button"
            onClick={onDelete}
            aria-label={`Удалить проект ${project.title}`}
            title="Удалить проект"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Форматирует время относительно текущего момента
 */
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'только что';
  } else if (diffMinutes < 60) {
    if (diffMinutes === 1) {
      return 'минуту назад';
    } else if (diffMinutes < 5) {
      return `${diffMinutes} минуты назад`;
    } else {
      return `${diffMinutes} минут назад`;
    }
  } else if (diffHours < 24) {
    if (diffHours === 1) {
      return 'час назад';
    } else if (diffHours < 5) {
      return `${diffHours} часа назад`;
    } else {
      return `${diffHours} часов назад`;
    }
  } else if (diffDays === 1) {
    return 'вчера';
  } else if (diffDays < 5) {
    return `${diffDays} дня назад`;
  } else {
    return `${diffDays} дней назад`;
  }
}