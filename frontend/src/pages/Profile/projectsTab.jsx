import React from 'react';
import { Plus, FolderGit2, ExternalLink, PenLine, Trash2 } from 'lucide-react';
import './projectsTab.css';

const ProjectsTab = ({ isOwner, projectsData, onOpenAddModal, onOpenEditModal, onDeleteProject }) => {
  return (
    <div className="projects-tab-wrapper">
      
      {/* Centralized Grid Header Module */}
      <div className="projects-tab-master-header">
        <h2>Projects</h2>
        {/* CONDITIONAL: Only reveal the Add trigger to the authorized Profile Owner */}
        {isOwner && (
          <button className="projects-master-add-naked-btn" onClick={onOpenAddModal} aria-label="Add new project card">
            <Plus className="master-add-svg" />
          </button>
        )}
      </div>

      {/* Grid Canvas Mapping Container */}
      <div className="projects-display-showcase-grid">
        {projectsData && projectsData.length > 0 ? (
          projectsData.map((project) => (
            <div key={project.id} className="project-showcase-card">
              
              <div className="project-media-banner-frame">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="project-banner-asset" />
                ) : (
                  <div className="project-banner-fallback-gradient">
                    <FolderGit2 size={32} strokeWidth={1.5} />
                  </div>
                )}

                {/* CONDITIONAL ACTION BUBBLES: Revealed strictly in Owner Contexts */}
                {isOwner && (
                  <div className="project-card-inline-actions">
                    <button className="card-inline-naked-action-btn" onClick={() => onOpenEditModal(project)} aria-label="Edit project">
                      <PenLine size={13} />
                    </button>
                    <button className="card-inline-naked-action-btn delete-type" onClick={() => onDeleteProject(project.id)} aria-label="Delete project">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Text Description Block Compartment */}
              <div className="project-card-body-compartment">
                <h4>{project.title || "Untitled Project"}</h4>
                <p>{project.description || "No documentation logs registered for this workspace profile yet."}</p>
                
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-card-link-anchor">
                    <span>Launch Live App</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="placeholder-panel-text" style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center' }}>
            <p>No deployment profiles registered inside this category grid yet.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProjectsTab;