// src/App.tsx
import { useState, useEffect } from 'react';
import type { Project } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProjectPage } from './pages/ProjectPage';
import { LandingPage } from './pages/LandingPage';

const STORAGE_KEY = 'contextkit_projects';
const LANDING_SEEN_KEY = 'contextkit_landing_seen';

// 🔹 Lazy initialization для избежания setState в useEffect
function getInitialProjects(): Project[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse projects', e);
    localStorage.removeItem(STORAGE_KEY);
  }
  return [];
}

function getInitialLandingState(): boolean {
  const hasSeenLanding = localStorage.getItem(LANDING_SEEN_KEY);
  return !hasSeenLanding;
}

function App() {
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(getInitialLandingState);

  // Сохранение в localStorage при изменении projects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleCreateProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
  };

  const handleBackToHome = () => {
    setActiveProjectId(null);
  };

  const handleStartFromLanding = () => {
    localStorage.setItem(LANDING_SEEN_KEY, 'true');
    setShowLanding(false);
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  // 🔹 Если показываем лендинг — рендерим ТОЛЬКО его
  if (showLanding) {
    return (
      <div className="container">
        {/* 🔹 Передаём handleStartFromLanding в LandingPage */}
        <LandingPage onStart={handleStartFromLanding} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      {/* 🔹 Header с обработчиком клика по логотипу */}
      <Header onLogoClick={handleBackToHome} />
      
      {activeProject ? (
        <ProjectPage
          project={activeProject}
          onUpdateProject={handleUpdateProject}
          onBack={handleBackToHome}
        />
      ) : (
        <HomePage
          projects={projects}
          onCreateProject={handleCreateProject}
          onSelectProject={handleSelectProject}
          onViewAllProjects={() => {}}
        />
      )}
      
      <Footer />
    </div>
  );
}

export default App;