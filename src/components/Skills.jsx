import React, { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/skill.css";
import { getTeckStackAPI } from '../service/allApi';
import { SERVER_URL } from '../service/serverURL';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const skills = [
    { name: "Data Science", percent: 95 },
    { name: "Machine Learning", percent: 95 },
    { name: "Natural Language Processing", percent: 90 },
    { name: "Modelling", percent: 92 },
    { name: "Computer Vision", percent: 95 },
    { name: "Prompt Engineering", percent: 80 },
    { name: "Data Visualization", percent: 90 },
    { name: "DevOps", percent: 90 },
    { name: "AI agent", percent: 70 },
    { name: "Debuging", percent: 96 },
    { name: "Data Structures and Algorithms", percent: 80 },
  ];

  const barRefs = useRef([]);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    barRefs.current.forEach((bar, index) => {
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: `${skills[index].percent}%`,
          duration: 1.5,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await getTeckStackAPI();
        if (res.status === 200) {
          setTools(res.data);
        } else {
          console.error("Failed to fetch tools:", res);
        }
      } catch (err) {
        console.error("Error", err);
      }
    };
    fetchTools();
  }, []);

  return (
    <div id='Skill-section'>
      <div className="skill-container">
        <div className="experts">
          <h3>Expertise Areas</h3>
        </div>
        <div className="skill-content">
          {skills.map((skill, i) => (
            <div className="bar" key={i}>
              <div className="base-bar">
                <div
                  className="fill-bar"
                  ref={(el) => (barRefs.current[i] = el)}
                ></div>
              </div>
              <h3>{skill.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="tools">
        <h3>Languages & Tools</h3>
        <div className="skill-icon-container">
          {tools.map((tool, index) => (
            <div className='skill-icon' key={tool._id || index}>
              <img
                src={`${SERVER_URL}${tool.logo}`}
                alt={tool.name}
                onError={(e) => (e.target.src = "/fallback.png")}
              />
              <div className='tooltip'>
               <p className="tool-name">{tool.name} <span className='tool-description'>{tool.description}</span></p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
