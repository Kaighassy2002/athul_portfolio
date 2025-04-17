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
      title: "International Virtual Assistant, Trivandrum",
      role: "Machine Learning Engineer",
      date: "July 2022 - Present",
      points: [
        "Designed and implemented a video analytics framework using Nvidia DeepStream and Kubernetes.",
        "Developed virtual sensors for gas turbine engines generating 54,000 records/sec.",
        "Processed high-fidelity data for research and development of turbine engines.",
      ],
    },
    {
      title: "Katomaran Technologies, Coimbatore",
      role: "Junior ML Engineer",
      date: "June 2020 - June 2022",
      points: [
        "Developed knowledge graph AI chatbot handling 90% queries autonomously.",
        "Worked on intent detection, NER, and generative models.",
        "Optimized object detection models for edge devices.",
        "Trained atomic action recognition models with actor-conditioned attention maps.",
      ],
    },
    {
      title: "Katomaran Technologies, Coimbatore",
      role: "Machine Learning Intern",
      date: "Dec 2019 - May 2020",
      points: [
        "Developed CV algorithms for security & safety.",
        "Conducted statistical analysis and model improvements.",
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

          {/* Show this as a SEPARATE card only for index 0 */}
          {index === 0 && activeTab === "experience" && (
            <div className="timeline-entry extra-card">
              <div className="timeline-left" />
              <div style={{ marginTop: "-22px" }} className="timeline-line" />
              <div className="timeline-right">
                <div className="extra-experience-info">
                  <h5 style={{ color: "#f6f6e9" }}>
                    Machine Learning Engineer
                  </h5>
                  <p>
                    Hands-on expertise in scalable video analytics systems,
                    real-time data engineering.
                  </p>
                </div>
              </div>
            </div>
          )}
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
    <option value="Mechine Learning">Mechine Learning</option>
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
        <img className="card__background" src={cert.image} alt={cert.category} />
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
