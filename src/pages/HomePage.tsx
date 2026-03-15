// src/pages/HomePage.tsx
import { useState } from 'react';
import type { Project } from '../types';
import { ProjectCard } from '../components/Projects/ProjectCard';
import { CreateProjectModal } from '../components/Projects/CreateProjectModal';
import { ExportImportPanel } from '../components/Home/ExportImportPanel';

interface Props {
  projects: Project[];
  onCreateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectProject: (projectId: string) => void;
}

export function HomePage({ 
  projects, 
  onCreateProject, 
  onDeleteProject,
  onSelectProject 
}: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false);

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

        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onSelectProject(project.id)}
            onDelete={(e) => {
              e.stopPropagation();
              onDeleteProject(project.id);
            }}
          />
        ))}
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