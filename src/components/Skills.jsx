import React, { useEffect, useRef } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/skill.css";
import aws from "../assets/images/aws.png";

import micro from "../assets/images/microk8s_.png";
import mongodb from "../assets/images/mongodb (2).png";
import mysql from "../assets/images/mysql (2).png";
import nltk from "../assets/images/nltk.png";
import opencv from "../assets/images/openCv.png";
import pandas from "../assets/images/pandas.png";
import pytorch from "../assets/images/pytorch.png";
import python from "../assets/images/python.png";
import tensor from "../assets/images/tensor-flow.png";
import spacy from "../assets/images/spacy.png";
import types from "../assets/images/type.png";
import rasa from "../assets/images/rasa.png";
import sklearn from "../assets/images/sklearn.png";
import numpy from "../assets/images/numpy.png";
import kafka from "../assets/images/kafka.png";
import yolo from "../assets/images/yolo.png";
import linux from "../assets/images/linux.png";
import git from "../assets/images/git.png";
import docker from "../assets/images/docker.png";
import kubernets from "../assets/images/kubernets.png";
import dj from "../assets/images/django.png";
import deepstream from "../assets/images/deepstream.png";
import lang from "../assets/images/lang chain.png";
import matplotlib from "../assets/images/matplotlib.png";
import milvus from "../assets/images/milvus.png";
import plotly from "../assets/images/plotly.png";
import seaborn from "../assets/images/seaborn.png";
import ultralytics from "../assets/images/ultralytics.png";
import rasbery from "../assets/images/raspberry.png";
import flask from "../assets/images/flask.png";
import chroma from "../assets/images/Chroma.png";
import ubuntu from "../assets/images/ubuntu.png";

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

  return (


   <div id='Skill-section'>
        <div className="skill-container">
          <div className="experts">
            <h3>Expertise Areas</h3>
          </div>
          <div className="skill-content">
            {skills.map((skill, i) => (
              <div className="bar" key={i}>
                
                {/* <span>{skill.percent}%</span> */}
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
          <h3 c>Languages & Tools</h3>

          <div className="skill-icon-container">
          <div className='skill-icon'>
                <img src={python} alt="Python" />
                <span className="tool-name">Python</span>
                
             </div>
             <div className='skill-icon'>
                <img src={tensor} alt="tensor" />
                <span className="tool-name">Tensorflow</span>
                
             </div>

             <div className='skill-icon'>
                <img src={pytorch} alt="pytorch" />
                <span className="tool-name">Pytorch</span>
                
             </div>
             <div className='skill-icon'>
                <img src={pandas} alt="pandas" />
                <span className="tool-name">Pandas</span>
                
             </div>
             <div className='skill-icon'>
                <img src={numpy} alt="numpy" />
                <span className="tool-name">Numpy</span>
                
             </div>
             <div className='skill-icon'>
                <img src={sklearn} alt="sklearn" />
                <span className="tool-name">sklearn</span>
                
             </div>
             <div className='skill-icon'>
                <img src={opencv} alt="opencv" />
                <span className="tool-name">Opencv</span>
                
             </div>
             <div className='skill-icon'>
                <img src={yolo} alt="yolo" />
                <span className="tool-name">Yolo</span>
                
             </div>
             <div className='skill-icon'>
                <img src={ultralytics} alt="Ultralytics" />
                <span className="tool-name">Ultralytics</span>
                
             </div>
             <div className='skill-icon'>
                <img src={deepstream} alt="Deepstream" />
                <span className="tool-name">Deepstream</span>
                
             </div>
             <div className='skill-icon'>
                <img src={matplotlib} alt="Matplotlib" />
                <span className="tool-name">Matplotlib</span>
                
             </div>
             <div className='skill-icon'>
                <img src={seaborn} alt="Seaborn" />
                <span className="tool-name">Seaborn</span>
                
             </div>
             <div className='skill-icon'>
                <img src={plotly} alt="plotly" />
                <span className="tool-name">Plotly</span>
                
             </div>
             <div className='skill-icon'>
                <img src={nltk} alt="nltk" />
                <span className="tool-name">NLTK</span>
                
             </div>
             <div className='skill-icon'>
                <img src={spacy} alt="spacy" />
                <span className="tool-name">Spacy</span>
                
             </div>
             <div className='skill-icon'>
                <img src={flask} alt="flask" />
                <span className="tool-name">Flask</span>
                
             </div>
             <div className='skill-icon'>
                <img src={dj} alt="DJANGO" />
                <span className="tool-name">Django</span>
                
             </div>
             <div className='skill-icon'>
                <img src={rasa} alt="rasa" />
                <span className="tool-name">Rasa</span>
                
             </div>
             <div className='skill-icon'>
                <img src={lang} alt="Lang chain" />
                <span className="tool-name">Lang chain</span>
                
             </div>
            
            
             
             <div className='skill-icon'>
                <img src={git} alt="git" />
                <span className="tool-name">Git</span>
                
             </div>
             
            
             <div className='skill-icon'>
                <img src={docker} alt="docker" />
                <span className="tool-name">Docker</span>
                
             </div>
             <div className='skill-icon'>
                <img src={kubernets} alt="kubernets" />
                <span className="tool-name">Kubernets</span>
                
             </div>
             <div className='skill-icon'>
                <img src={micro} alt="micro" />
                <span className="tool-name">Microk8s</span>
                
             </div>
             <div className='skill-icon'>
                <img src={kafka} alt="kafka" />
                <span className="tool-name">Kafka</span>
                
             </div>
             
             <div className='skill-icon'>
                <img src={mysql} alt="mysql" />
                <span className="tool-name">MYSQL</span>
                
             </div>
             <div className='skill-icon'>
                <img src={mongodb} alt="mongodb" />
                <span className="tool-name">MongoDB</span>
                
             </div>
            
             
             <div className='skill-icon'>
                <img src={types} alt="Type DB" />
                <span className="tool-name">Type DB</span>
                
             </div>
             <div className='skill-icon'>
                <img src={milvus} alt="Milvus" />
                <span className="tool-name">Milvus</span>
                
             </div>
             
             
            
             
             <div className='skill-icon'>
                <img src={chroma} alt="chroma" />
                <span className="tool-name">Chroma</span>
                
             </div>
             
            
             <div className='skill-icon'>
                <img src={linux} alt="linux" />
                <span className="tool-name">Linux</span>
                
             </div>
            
             
             <div className='skill-icon'>
                <img src={ubuntu} alt="ubantu" />
                <span className="tool-name">Ubuntu</span>
                
             </div>
             
             
            
            
            
             <div className='skill-icon'>
                <img src={rasbery} alt="raspberry" />
                <span className="tool-name">Raspberry pie</span>
                
             </div>
             <div className='skill-icon'>
                <img src={aws} alt="Amazon sagemaker" />
                <span className="tool-name">Amazon Sagemaker</span>
                
             </div>
          </div>
          </div>
   </div>
  );
};

export default Skills;
