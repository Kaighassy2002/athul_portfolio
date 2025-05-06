import React from 'react';
import '../styles/footer.css';
import me from "../assets/images/Me.png";

function Footer() {
  return (
    <>
     <div className='footer-section'>
        <div className="footer">
          <div className="footer-social mb-4">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
  
          <hr className="footer-divider" />
  
          <footer className="footer-content">
            <img src={me} alt="logo" className="footer-logo" />
            <p className="footer-copy">
              © {new Date().getFullYear()} Athul. All rights reserved.
            </p>
            <p className="footer-love">
              Made with <span>❤️</span> by <a style={{textDecoration:"none", color:"white"}} href="https://portfolio-my-alpha.vercel.app/" target="_blank" rel="noopener noreferrer">
              Kaighassy Suresh
            </a>
            </p>
          </footer>
        </div>
     </div>
    </>
  );
}

export default Footer;
