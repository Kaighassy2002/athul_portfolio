import React, { useEffect, useState } from 'react';
import { blogByIdAPI } from '../service/allApi';
import { useParams } from "react-router-dom";
import BlogContentViewer from '../components/BlogContentViewer';
import Header from '../components/Header';

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    blogByIdAPI(id)
      .then(res => {
        const blogData = res.data.data;
        console.log("Blog content:", blogData.content);
        if (!blogData || !blogData.content) {
          setError("No content available.");
          return;
        }
        
        const parsedContent = typeof blogData.content === "string"
          ? JSON.parse(blogData.content)
          : blogData.content;

        setBlog({ ...blogData, content: parsedContent });
      })
      .catch(err => {
        console.error("Failed to fetch blog:", err);
        setError("Failed to load blog content.");
      });
  }, [id]);
  

  if (error) return <p className="text-center my-5 text-danger">{error}</p>;
  if (!blog) return <p className="text-center my-5">Loading...</p>;

  const hasContent = blog.content?.root?.children?.length > 0;

  return (
    <div>
      <Header/>
      <div className="container my-5">
        <h1 className="mb-2 text-dark fs-6">{blog.title}</h1>
        <p className="text-muted">
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt="cover"
            className="mb-4 rounded img-fluid"
          />
        )}
        {/* Content Viewer or Fallback Message */}
       {hasContent ? (
  <BlogContentViewer  content={blog.content}/>
) : (
  <p className="text-center mt-4">No content available.</p>
)}
      </div>
    </div>
  );
}

export default BlogDetails;
