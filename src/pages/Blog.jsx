import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "../styles/blog.css";

function Blog() {
  return (
    <div className="blog-container">
      <Header />
      <div className="blog-main-container">
        <div className="image-overlay-container">
          <img
            className="blog-image"
            src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
            alt=""
          />
          <div className="text-overlay">
            <p className="hashtags">#Learn</p>
            <h3>Hello</h3>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
            <p className="date">March 7, 2025</p>
          </div>
        </div>
      </div>

      <div className="blogs-section">
        
      </div>
    </div>
  );
}

export default Blog;
