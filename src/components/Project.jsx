import React, { useEffect, useState } from 'react';
import "../styles/project.css";
import { getProjectAPI } from '../service/allApi';
import { SERVER_URL } from '../service/serverURL';

function Project() {
  const [projects, setProjects] = useState([]);
  const [showAllTechs, setShowAllTechs] = useState({});
  const [showFullDescriptions, setShowFullDescriptions] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await getProjectAPI();
      setProjects(Array.isArray(res.data) ? res.data : []);
    };
    fetchProjects();
  }, []);

  const toggleShowAllTechs = (index) => {
    setShowAllTechs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleDescription = (index) => {
    setShowFullDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="project-container">
      <h3>Recent Works <i className="fa-solid fa-briefcase"></i></h3>
      <div className="project-cards-container">
        {projects.map((project, index) => {
          const maxVisible = 4;
          const techs = project.tech_stack || [];
          const visibleTechs = techs.slice(0, maxVisible);
          const hiddenTechs = techs.slice(maxVisible);
          const showAll = showAllTechs[index];
          const showFullDesc = showFullDescriptions[index];

          const words = project.description?.split(" ") || [];
          const shouldTruncate = words.length > 50;
          const displayedDescription = showFullDesc || !shouldTruncate
            ? project.description
            : words.slice(0, 50).join(" ") + "...";

          return (
            <div className="card-project" key={index}>
              <img src={project.image} alt={project.title} />
              <div className="card-content">
                <h4>{project.title}</h4>

                <div className="tech-stack-list">
                  {visibleTechs.map((tech, i) => (
                    <div key={i} className="tech-item">
                      <img src={`${SERVER_URL}${tech.logo}`} alt={tech.name} className="tech-logo" />
                      <span className="tech-name">{tech.name}</span>
                    </div>
                  ))}
                  {!showAll && hiddenTechs.length > 0 && (
                    <div className="tech-item more-tech" onClick={() => toggleShowAllTechs(index)}>
                      +{hiddenTechs.length}
                    </div>
                  )}
                  {showAll && hiddenTechs.map((tech, i) => (
                    <div key={`more-${i}`} className="tech-item">
                      <img src={`${SERVER_URL}${tech.logo}`} alt={tech.name} className="tech-logo" />
                      <span className="tech-name">{tech.name}</span>
                    </div>
                  ))}
                </div>

                <p>
                  {displayedDescription}
                  {shouldTruncate && (
                    <span
                      onClick={() => toggleDescription(index)}
                      className="read-more-toggle"
                    >
                      {showFullDesc ? " Show less" : " Read more"}
                    </span>
                  )}
                </p>

                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    View Project
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Project;
