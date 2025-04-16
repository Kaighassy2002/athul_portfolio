import React from 'react';
import "../styles/project.css";

function Project() {
  const projects = [
    {
      title: "Portfolio Website",
      description: "A personal portfolio website showcasing skills and projects.",
      image: "https://via.placeholder.com/300x200",
      link: "https://your-portfolio-link.com"
    },
    {
      title: "E-Commerce App",
      description: "An e-commerce platform with shopping cart and user login.",
      image: "https://via.placeholder.com/300x200",
      link: "https://ecommerce-app-demo.com"
    },
    {
      title: "Blog Platform",
      description: "A full-featured blog platform with user authentication.",
      image: "https://via.placeholder.com/300x200",
      link: "https://blog-platform-demo.com"
    },
    {
      title: "Doctor Finder",
      description: "Location-based web app to find doctors nearby.",
      image: "https://via.placeholder.com/300x200",
      link: "https://doctor-finder-demo.com"
    },
  ];

  return (
    <div className="project-container">
      <h3>Recent Works</h3>
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
