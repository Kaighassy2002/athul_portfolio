import React from 'react';
import "../styles/project.css";

function Project() {
  const projects = [
    {
      title: "Project 1",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit..",
      image: "https://via.placeholder.com/300x200",
      link: "https://your-project-demo.com"
    },
    {
      title: "Project 2",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image: "https://via.placeholder.com/300x200",
      link: "https://project2-demo.com"
    },
    {
      title: "Project 3",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image: "https://via.placeholder.com/300x200",
      link: "https://project3-demo.com"
    },
    {
      title: "Project 4",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      image: "https://via.placeholder.com/300x200",
      link: "https://project4-demo.com"
    },
  ];

  return (
    <div className="project-container">
      <h3>Recent Works <i className="fa-solid fa-briefcase"></i></h3>
      <div className="project-cards-container">
        {projects.map((project, index) => (
          <div className="card" key={index}>
            <img src={project.image} alt={project.title} />
            <div className="card-content">
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                View Project  
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Project;
