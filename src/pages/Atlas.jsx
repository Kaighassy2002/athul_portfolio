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
            Hey, I'm Athul Suresh <br />— a Machine Learning Engineer who loves
            building smarter, real-world AI systems. With 5+ years in video
            analytics, NLP, and sensor data, I focus on turning ideas into
            useful, human-centered solutions. I'm all about making AI simpler,
            scalable, and meaningful — not just models, but systems that matter.
            I enjoy solving tough problems and finding patterns in messy data.
            This portfolio is a glimpse into that journey — fueled by curiosity
            and a love for learning.
          </p>
          <button className="btn">View Resume</button>
        </div>
        {/* <div className="horizontal-line"></div> */}

        
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
