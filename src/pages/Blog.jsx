import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "../styles/blog.css";
import { Col, Row } from "react-bootstrap";

function Blog() {
  return (
    <div className="blog-container">
      <Header />
      <div className="blog-main-container ">
      <div className="blog-grid">
  <div className="blog-card large">
    <img src="https://e1.pxfuel.com/desktop-wallpaper/352/709/desktop-wallpaper-night-aesthetic-laptop-city-aesthetic.jpg" alt="" />
    <div className="card-overlay">
      <span className="category">Music</span>
      <h2>You have gotta be natural</h2>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <p className="date"><i className="fa-solid fa-calendar-days"></i> March 17, 2016</p>
    </div>
  </div>

  <div className="blog-card small">
    <img src="https://wallpapers-clan.com/wp-content/uploads/2024/10/orange-room-preppy-study-aesthetic-desktop-wallpaper-cover.jpg" alt="" />
    <div className="card-overlay">
      <span className="category">Learn</span>
      <h2>Change is always happening</h2>
      <p className="date"><i className="fa-solid fa-calendar-days"></i> March 17, 2016</p>
    </div>
  </div>

  <div className="blog-card small">
    <img src="https://wallpapers.com/images/hd/1920x1080-aesthetic-exx6pl8lkq9ai9p1.jpg" alt="" />
    <div className="card-overlay">
      <span className="category">Nature</span>
      <h2>Fashion is not about clothes, it is about a look</h2>
      <p className="date"><i className="fa-solid fa-calendar-days"></i> March 17, 2016</p>
    </div>
  </div>

 
</div>
      <div className="recent-blogs">
        <h2>Recent Blogs</h2>
      </div>
      </div>

     

      <Footer/>
    </div>
  );
}

export default Blog;
