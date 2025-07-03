import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/Atlas.css";
import Header from "../components/Header";

import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Project from "../components/Project";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

function Atlas() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const aboutTextRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const aboutRef = useRef(null);
  const projectRef = useRef(null);

  useEffect(() => {
    // Left Section Animation
    gsap.fromTo(
      [
        titleRef.current,
        subtitleRef.current,
        aboutTextRef.current,
        buttonRef.current,
      ],
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.3 }
    );

    gsap.to(imageRef.current, {
      y: 50,
      opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      },
    });

    // Parallax Effect for About and Project Sections
    gsap.to(aboutRef.current, {
      backgroundPositionY: "50%",
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.to(projectRef.current, {
      backgroundPositionY: "50%",
      scrollTrigger: {
        trigger: projectRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <>
      <div className="atlas">
        <Header />
        <div className="atlas-container">
          <div className="atlas-left">
            <h1 className="atlas-title" ref={titleRef}>
              ATHUL <span style={{ color: "#457d58", fontFamily:"Hammersmith One"}}>SURESH</span>
            </h1>
            <p className="atlas-subtitle" ref={subtitleRef}>
              AI/ML Engineer | Python Enthusiast | Building Intelligent Systems
            </p>
            <hr className="atlas-divider" />
           
          </div>
          
          <div className="altals-right">
            <p className="atlas-about" ref={aboutTextRef}>
              
            </p>
          </div>
        </div>
      </div>

      <div className="about-container" ref={aboutRef}>
        <div className="about">
          <h2>Behind the Algorithms</h2>
          <p>
          <span >Inside Atlas</span> — a Machine Learning Engineer shaping intelligent systems that connect data to decisions. With 5+ years across video analytics, NLP, and large-scale, high-fidelity sensor data, I build AI pipelines that are scalable, interpretable, and built for the real world. From face recognition in crowded spaces to AI agents that answer questions and generate insights, my work lives at the intersection of deep tech and practical impact. I'm all about making AI simpler, scalable, and meaningful — not just models, but systems that matter. I enjoy solving tough problems and finding patterns in messy data. I care about clean architecture, reliable systems, and finding clarity in complexity. This page is a curated map of that path — experiments, experiences, and everything in between.
          </p>
          <a className="btn-resume" href="https://drive.google.com/file/d/1P4aRSAarN1EQOTn9JfeL1VMEozFnnu_D/view" target="_blank" rel="noopener noreferrer">
  <button className="btn resume">View Resume</button>
</a>

        </div>
        

        
      </div>

      {/* Skill */}

      <Skills/>
      <Experience/>

      <Project/>


     <Footer/>
           
      
    </>
  );
}

export default Atlas;
