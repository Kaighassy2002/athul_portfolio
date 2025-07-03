import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/scribble.css";
import Footer from "../components/Footer";
import { listAllScribblesAPI } from "../service/allApi";
import { Link } from "react-router-dom";


function Scribble() {
  const [allScribles ,setAllScribles] = useState([]);
  const [loading, setLoading] = useState(true);
   const scribbleItems = allScribles.filter((scribble) => scribble.type === "scribble");
     useEffect(() => {
       const fetchBlogs = async () => {
         try {
           const response = await listAllScribblesAPI();
           console.log("API response:", response.data);
   
           setAllScribles(
             Array.isArray(response.data?.data) ? response.data.data : []
           );
         } catch (error) {
           console.error("Error fetching blogs:", error);
           setAllScribles([]);
         } finally {
           setLoading(false);
         }
       };
   
       fetchBlogs();
     }, []);
   
  return (
    <>
      <div className="scribble-main-container d-flex flex-column">
        <div 
        style={{background: "linear-gradient(to right,rgb(139, 160, 134),rgb(48, 85, 40))"}}
        >
          <Header />
        </div>

        <div className="  text-center  scribble-container ">
          <h1 className="scribble-heading">SCRIBBLE</h1>
          <p>Not a blog. Just me oversharing</p>
        </div>
      </div>
     <div className="scribble-list-contaniner p-5">
      <h3 className="scribble-list-heading">Stuff that just… happened.</h3>
  {loading ? (
    <p className="text-center">Loading...</p>
  ) : scribbleItems.length === 0 ? (
    <p className="text-center">No scribbles found.</p>
  ) : (
   <ul className="scribble-list ps-3">
  {scribbleItems.map((item, index) => (
    <Link
      to={`/scribble/${item._id}`}
      key={index}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <li className="scribble-item">
        <span className="scribble-dot" />
        <div className="scribble-content">
          <strong>{item.title || "Untitled"}</strong> |{" "}
          <span className="scribble-date">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </li>
    </Link>
  ))}
</ul>

  )}
</div>


      <Footer/>
    </>
  );
}

export default Scribble;
