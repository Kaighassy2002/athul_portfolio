import React, { useEffect, useRef, useState } from "react";
import "../styles/experience.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { getAllcertificatesAPI } from "../service/allApi";



gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const [activeTab, setActiveTab] = useState("experience");
  const timelineRef = useRef([]);

  const [certificate,setcertificate] = useState([])
  const [showFilter, setShowFilter] = useState(false);
const [filters, setFilters] = useState({
  category: "",
  organization: "",
  date: "",
});
const [filteredCertificates, setFilteredCertificates] = useState([]);


  const experienceData = [
    {
      title: " Zillion Tech, Sharjah, UAE",
      role: "Technology Officer",
      date: " Dec 2024 - Present",
      points: [
        "Led the design and deployment of a video analytics framework using NVIDIA Deepstream and Kubernetes, enabling real-time insights for retail outlets and driving ROI improvements.",
        "Architected microservices to support modular ML pipelines and improve system maintainability",
        "Developed AI agents to automatically generate business reports from customer behavior insights derived from video analytics using natural language queries",
        "Built a Conversational RAG-based document retrieval system with source citations and integrated question answering capabilities.",
      ],
    },
    {
      title: "International Virtual Assistant, Trivandrum, India",
      role: "Machine Learning Engineer",
      date: "July 2022 - Present",
      points: [
        "Built a real-time face recognition module for security monitoring in high footfall areas.",
        "Developed offline virtual sensors for gas turbine engines processing 54,000 records/sec to enable real-time performance monitoring and optimization.",
        "Engineered ETL pipelines and one-click solutions for sensor validation, anomaly detection, and trend deviation alerts using high-fidelity sensor data",
        "Processed and synchronized large-scale sensor data to support R&D in advanced engine technologies"
      ],
    },
    {
      title: "Katomaran Technologies, Coimbatore, India",
      role: "Junior ML Engineer",
      date: "June 2020 - June 2022",
      points: [
        "Designed and deployed a knowledge graph-driven Intent based chatbot using TypeDB, capable of resolving 90% of user queries autonomously.",
        "Diagnosed object detection models and improved inference speed by 1.3X without major accuracy loss, enabling deployment on edge and low-resource devices",
        "Trained an atomic action recognition model using actor conditioned attention map technique.",
        "Managed end-to-end ML pipelines—from data collection and model training to deployment, testing, and reporting",
      ],
    },
    {
      title: "Katomaran Technologies, Coimbatore, India",
      role: "Machine Learning Intern",
      date: "Dec 2019 - May 2020",
      points: [
        "Developed computer vision algorithms for security monitoring and safety surveillance systems.",
        "Collaborated with ML experts on model development and tool optimization.",
        "Conducted statistical analysis of test results and performed literature reviews to propose solution strategies."
      ],
    },
  ];

  const educationData = [
    {
      title: "APJ Abdul Kalam Technological University, Kerala",
      role: "B.Tech in Computer Science and Engineering",
      date: "Aug 2019",
      points: [
        "GPA: 7.39 / 10.0",
        "Coursework: Music Genre Recognition using MFCCs",
        "Seminar: Effective Machine Learning with Cloud TPU",
        "Internshala Campus Ambassador - led a marketing & ad campaign to increase memberships",
      ],
    },
  ];

  useEffect(() => {
    // Animate each timeline-entry as it scrolls into view
    timelineRef.current.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, [activeTab]);

  const renderTimeline = (dataArray) => (
    <div className="timeline-vertical">
      {dataArray.map((item, index) => (
        <React.Fragment key={index}>
          <div
            className="timeline-entry"
            ref={(el) => (timelineRef.current[index] = el)}
          >
            <div className="timeline-left">
              <h4>{item.title}</h4>
              <hr />
              <p className="timeline-date">{item.date}</p>
            </div>
            <div className="timeline-line" />
            <div className="timeline-right">
              <p className="timeline-role">
                <strong>{item.role}</strong>
              </p>
              <ul>
                {item.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          
        </React.Fragment>
      ))}
    </div>
  );

  //get All certificates

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await getAllcertificatesAPI();
        if (response.status === 200) {
          const sortedData = response.data.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          setcertificate(sortedData);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };
  
    fetchCertificates();
  }, []);
  

  //toggle button 

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  //filter


  useEffect(() => {
    const filtered = certificate
      .filter((cert) => {
        return (
          (filters.category === "" || cert.category.toLowerCase().includes(filters.category.toLowerCase())) &&
          (filters.organization === "" || cert.organization.toLowerCase().includes(filters.organization.toLowerCase()))
        );
      })
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Sort by newest first
  
    setFilteredCertificates(filtered);
  }, [filters, certificate]);
  
  const clearFilters = () => {
    setFilters({ category: "", organization: "" });
  };
  

  return (
    <div className="experience-container">
      <div className="section-container">
        <h3>
          My Career <i className="fa-solid fa-user-graduate"></i>
        </h3>
        <div className="tab-switch">
          <button
            className={activeTab === "education" ? "active" : ""}
            onClick={() => setActiveTab("education")}
          >
            Education
          </button>
          <button
            className={activeTab === "experience" ? "active" : ""}
            onClick={() => setActiveTab("experience")}
          >
            Experience
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "experience" && renderTimeline(experienceData)}
          {activeTab === "education" && renderTimeline(educationData)}
        </div>
      </div>
 
        

        {/* certificate-section */}

      <div className="certificate-section">
        <h3>
          Certificates <i class="fa-solid fa-award"></i>
        </h3>

        {/* filter-certificate */}


        <div className="filter-certificate-section">
  <button className="btn" onClick={toggleFilter}>
    <i className="fa-solid fa-filter filter"></i>
  </button>
  {showFilter && (
  <div className="filter-panel">
    <button className="close-btn" onClick={toggleFilter}>
      <i className="fa-solid fa-xmark"></i>
      </button>
    <div className="filter-panel-header">
      <h4>Filter Certificates</h4>
      
    </div>

    <div className="filter-input-container">
  <select
    className="filter-input"
    name="category"
    value={filters.category}
    onChange={handleFilterChange}
  >
    <option value="" disabled>Select Category</option>
    <option value="Data Science">Data Science</option>
    <option value="Machine Learning">Machine Learning</option>
    <option value="System Design">System Design</option>
    
  </select>

  <select
    className="filter-input "
    name="organization"
    value={filters.organization}
    onChange={handleFilterChange}
  >
    <option value="" disabled>Select Organization</option>
    <option value="Udemy">Udemy</option>
    <option value="Coursera">Coursera</option>
    
    
  </select>
</div>

    

    {/* Clear Button */}
    <button className="clear-btn" onClick={clearFilters}>
      Clear 
    </button>
  </div>
)}


</div>

{/* certificates */}

<div className="certificate-container">
  {filteredCertificates.length === 0 && filters.category === "" && filters.organization === "" && filters.date === "" ? (
    <p>Loading...</p>
  ) : (filteredCertificates.length === 0 ? (
    <p className="no-items">No certificates found for selected filters.</p>
  ) : (
<Swiper
  modules={[Autoplay, Pagination]}
  spaceBetween={20}
  slidesPerView={1}
  pagination={{
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: false, // we’re handling custom bullet visibility
  }}
  autoplay={{ delay: 2500, disableOnInteraction: false }}
  breakpoints={{
    0: { slidesPerView: 1, spaceBetween: 10 },
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 4 },
  }}
  onPaginationUpdate={(swiper, paginationEl) => {
    const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
    bullets.forEach((b, i) => {
      b.style.display = 'none'; // hide all bullets

      if (
        i === swiper.activeIndex ||
        i === swiper.activeIndex - 1 ||
        i === swiper.activeIndex + 1
      ) {
        b.style.display = 'block'; // show active, prev, next
      }
    });
  }}
>
  {(filteredCertificates.length ? filteredCertificates : certificate).map((cert, index) => (
    <SwiperSlide key={index}>
      <div className="card">
        <img loading="lazy" className="card__background" src={cert.image} alt={cert.category} />
        <div className="card__content | flow">
          <div className="card__content--container | flow">
            <h2 className="card__title">{cert.category}</h2>
            <p className="card__description">
              {cert.organization} | {cert.startDate}
            </p>
          </div>
          <a
            href={cert.links}
            className="card__button"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Certificate
          </a>
        </div>
      </div>
    </SwiperSlide>
  ))}
  <div className="swiper-pagination"></div>
</Swiper>

  ))}
</div>




      </div>
    </div>
  );
};

export default Experience;
