import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

import "../styles/blog.css";
import { listAllBlogsAPI } from "../service/allApi";

function Blog() {
  const [allBlogs, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await listAllBlogsAPI();
        console.log("API response:", response.data);

        setBlogList(
          Array.isArray(response.data?.data) ? response.data.data : []
        );
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const allTags = allBlogs.flatMap(
    (blog) => blog.tags?.map((tag) => tag.trim()) || []
  );

  // Get unique categories
  const uniqueCategories = [...new Set(allTags)];

  // Pick 3 random categories
  const randomCategories = uniqueCategories
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Pick the first blog for each of the selected categories
   const featuredBlogs = randomCategories.map((tag) =>
    allBlogs.find((blog) => blog.tags?.includes(tag))
  );

  return (
    <div className="blog-container">
      <Header />

      <div className="blog-main-container">
        <div className="blog-grid">
          {featuredBlogs.map((blog, index) =>
            blog ? (
              <div
                className={`blog-card ${index === 0 ? "large" : "small"}`}
                
              >
                <Link
                  to={`/blog/${blog._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img loading="lazy" src={blog.coverImageUrl} alt={blog.title} />
                  <div className="card-overlay">
                    <span className="category">
                      {blog.tags?.[0] || "Uncategorized"}
                    </span>
                    <h2>{blog.title}</h2>
                   
                    <p className="date">
                      <i className="fa-solid fa-calendar-days"></i>{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </div>
            ) : null
          )}
        </div>

        {/* Recent Blogs Section */}
        <div className="recent-blogs container my-5">
          <h2 className="text-center mb-4">Recent Blogs</h2>
          <div className="row">
            {/* Blog Cards */}
           <div className="col-md-8">
  <div className="row g-5">
    {/* Card View (First 6 Blogs) */}
    {allBlogs
      .filter((blog) => !selectedCategory || blog.tags?.includes(selectedCategory))
      .slice(0, 6) // First two rows (3 per row)
      .map((blog) => (
        <div className="col-md-4" key={blog._id}>
          <Link
            to={`/blog/${blog._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="card h-100 shadow-sm">
              <img
                src={blog.coverImageUrl}
                className="card-img-top"
                alt={blog.title}
                loading="lazy"
              />
              <div className="card-body">
                <p className="date text-dark">
                  <i className="fa-solid fa-calendar-days"></i>{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">{blog.text}</p>
                <span className="category hastag">{blog.tags?.join(", ")}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
  </div>

  {/* List View (Remaining Blogs) */}
  <div className="mt-5">
    {allBlogs
      .filter((blog) => !selectedCategory || blog.tags?.includes(selectedCategory))
      .slice(6, visibleCount) // From 7th blog onward
      .map((blog) => (
        <div className="mb-4" key={blog._id}>
          <Link
            to={`/blog/${blog._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="d-flex align-items-start border-bottom pb-3">
              <img
                src={blog.coverImageUrl}
                alt={blog.title}
                style={{ width: "120px", height: "80px", objectFit: "cover", marginRight: "1rem" }}
              />
              <div>
                <p className="date text-muted mb-1">
                  <i className="fa-solid fa-calendar-days"></i>{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <h5 className="mb-1">{blog.title}</h5>
                <span className="category hastag">{blog.tags?.join(", ")}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
  </div>

  {visibleCount < allBlogs.length && (
    <div className="text-center mt-4">
      <button className="btn btn-outline-primary" onClick={handleLoadMore}>
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
                    className={`list-group-item ${
                      selectedCategory === null ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(null)}
                    style={{ cursor: "pointer" }}
                  >
                    All
                  </li>
                  {uniqueCategories.map((tags) => (
                    <li
                      key={tags}
                      className={`list-group-item ${
                        selectedCategory === tags ? "active" : ""
                      }`}
                      onClick={() => setSelectedCategory(tags)}
                      style={{ cursor: "pointer" }}
                    >
                      {tags}
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
