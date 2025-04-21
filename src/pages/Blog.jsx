import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

import "../styles/blog.css";

function Blog() {
  const allBlogs = [
    {
      id: 1,
      title: "Card Title 1",
      text: "Some quick example text to build on the card title.",
      img: "https://picsum.photos/seed/blog1/400/200",
      category: "Home",
      date: "July 10, 2024",
    },
    {
      id: 2,
      title: "Card Title 2",
      text: "Some interesting insights about technology.",
      img: "https://picsum.photos/seed/blog2/400/200",
      category: "Technology",
      date: "January 17, 2024",
    },
    {
      id: 3,
      title: "Card Title 3",
      text: "Nature is beautiful and peaceful.",
      img: "https://picsum.photos/seed/blog3/400/200",
      category: "Nature",
      date: "Jan 13, 2025",
    },
    {
      id: 4,
      title: "Card Title 4",
      text: "Fashion trends evolve every season.",
      img: "https://picsum.photos/seed/blog4/400/200",
      category: "Home",
      date: "December 17, 2024",
    },
    {
      id: 5,
      title: "Card Title 5",
      text: "More content about tech, life, and creativity.",
      img: "https://picsum.photos/seed/blog5/400/200",
      category: "Nature",
    },
    {
      id: 6,
      title: "Card Title 6",
      text: "Interesting blog snippet continues here.",
      img: "https://picsum.photos/seed/blog6/400/200",
      category: "Fashion",
      date: "October 27, 2024",
    },
    {
      id: 7,
      title: "Card Title 7",
      text: "Interesting blog snippet continues here.",
      img: "https://wallpapers-clan.com/wp-content/uploads/2024/10/orange-room-preppy-study-aesthetic-desktop-wallpaper-cover.jpg",
      category: "Learn",
      date: "December 07, 2024",
    },
  ];

  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };
  // Get unique categories
  const uniqueCategories = [...new Set(allBlogs.map((blog) => blog.category))];

  // Pick 3 random categories
  const randomCategories = uniqueCategories
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Pick the first blog for each of the selected categories
  const featuredBlogs = randomCategories.map((category) =>
    allBlogs.find((blog) => blog.category === category)
  );

  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="blog-container">
      <Header />

      <div className="blog-main-container">
        <div className="blog-grid">
          {featuredBlogs.map((blog, index) => (
            <div
              className={`blog-card ${index === 0 ? "large" : "small"}`}
              key={blog.id}
            >
              <Link
                to={`/blog/${blog.id}`}
                key={blog.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={blog.img} alt={blog.title} />

                <div className="card-overlay">
                  <span className="category">{blog.category}</span>
                  <h2>{blog.title}</h2>
                  <p>{blog.text}</p>
                  <p className="date">
                    <i className="fa-solid fa-calendar-days"></i> {blog.date}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Recent Blogs Section */}
        <div className="recent-blogs container my-5">
          <h2 className="text-center mb-4">Recent Blogs</h2>
          <div className="row">
            {/* Blog Cards */}
            <div className="col-md-8">
              <div className="row g-4">
              {allBlogs
  .filter((blog) => !selectedCategory || blog.category === selectedCategory)
  .slice(0, visibleCount)
  .map((blog) => (
                  <div className="col-md-4" key={blog.id}>
                    <Link
                      to={`/blog/${blog.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="card h-100 shadow-sm">
                        <img
                          src={blog.img}
                          className="card-img-top"
                          alt={blog.title}
                        />
                        <div className="card-body">
                          <p className="date">
                            <i className="fa-solid fa-calendar-days"></i>{" "}
                            {blog.date}
                          </p>
                          <h5 className="card-title">{blog.title}</h5>
                          <p className="card-text">{blog.text}</p>
                          <span className="category hastag">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {visibleCount < allBlogs.length && (
                <div className="text-center mt-4">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleLoadMore}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-md-4">
              <div className="p-4 bg-light rounded shadow-sm">
                <h3 className="mb-3 category-head">Categories</h3>
                <ul className="list-group">
  <li
    className={`list-group-item ${selectedCategory === null ? "active" : ""}`}
    onClick={() => setSelectedCategory(null)}
    style={{ cursor: "pointer" }}
  >
    All
  </li>
  {uniqueCategories.map((category) => (
    <li
      key={category}
      className={`list-group-item ${
        selectedCategory === category ? "active" : ""
      }`}
      onClick={() => setSelectedCategory(category)}
      style={{ cursor: "pointer" }}
    >
      {category}
    </li>
  ))}
</ul>

              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Blog;
