// src/pages/HomePage.tsx
import { useState } from 'react';
import type { Project } from '../types';
import { ProjectCard } from '../components/Projects/ProjectCard';
import { CreateProjectModal } from '../components/Projects/CreateProjectModal';
import { ExportImportPanel } from '../components/Home/ExportImportPanel';

interface Props {
  projects: Project[];
  onCreateProject: (project: Project) => void;
  onSelectProject: (projectId: string) => void;
  onViewAllProjects?: () => void;
}

export function HomePage({ 
  projects, 
  onCreateProject, 
  onSelectProject, 
  onViewAllProjects 
}: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const visibleProjects = projects.slice(0, 6);
  const hasMoreProjects = projects.length > 6;

  return (
    <div className="home-page">
      {/* 🔹 Панель экспорта/импорта — ЕДИНСТВЕННОЕ МЕСТО для этих кнопок */}
      <ExportImportPanel 
        projects={projects} 
        onImportProjects={(imported) => {
          imported.forEach(project => onCreateProject(project));
        }} 
      />
      
      <div className="projects-grid">
        <button 
          className="project-card create-new"
          onClick={() => setShowCreateModal(true)}
          aria-label="Создать новый проект"
        >
          <span className="plus-icon">+</span>
          <span className="card-title">Новый проект</span>
        </button>

        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onSelectProject(project.id)}
          />
        ))}

        {hasMoreProjects && onViewAllProjects && (
          <button 
            className="project-card view-all"
            onClick={onViewAllProjects}
            aria-label="Посмотреть все проекты"
          >
            <span className="card-title">Все проекты</span>
            <span className="projects-count">({projects.length})</span>
          </button>
        )}
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(newProject) => {
            onCreateProject(newProject);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}