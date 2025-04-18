import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "../styles/landing.css";
import gsap from 'gsap';
import Header from "../components/Header";




function Landing() {
  const [step, setStep] = useState(0);
  const textRef = useRef(null);
  const btnRef = useRef(null);

  const texts = [
    "I write code, train machines, and sometimes, they even listen.",
    "Born and raised in Kerala, I've always been drawn to the intersection of logic and creativity.",
    "Whether it's building AI models, automating workflows, or just experimenting with Python scripts that do weird but interesting things...",
    "This space isn't about a grand vision or a carefully curated theme—just a mix of experiments, ideas, and half-baked thoughts.",
    "Think of it as my little corner of the internet where I scribble, build, and break things."
  ];

  useEffect(() => {
    let currentStep = 0;
    let delay = 800; 
    const showNext = () => {
      setStep(currentStep + 1);
      currentStep++;
  
      
      delay += 1300;
  
      if (currentStep < texts.length + 1) {
        setTimeout(showNext, delay);
      }
    };
  
    setTimeout(showNext, delay);
  
    return () => clearTimeout();
  }, []);
  
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
      );
    }

    if (btnRef.current && step === texts.length + 1) {
      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" }
      );
    }
  }, [step]);

  return (
    <div className='landing-container'>
      <Header />
      <div className="main-container">
        <h1 className='main-head'>Hello I'm Athul</h1>

        <div className='text-container'>
          {step > 0 && step <= texts.length && (
            <p className='fade-text' ref={textRef}>{texts[step - 1]}</p>
          )}
        </div>

        {step > texts.length && (
          <Link to={'/atlas'} style={{textDecoration:'none'}}>
            <button className='btn view-more' ref={btnRef}>
              View More <i className="fa-solid fa-circle-arrow-right"></i>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Landing;
