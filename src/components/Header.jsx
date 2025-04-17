import React from 'react'
import { Link } from "react-router-dom";
import me from "../assets/images/Me (2).png";
import { Container, Nav, Navbar } from 'react-bootstrap';


function Header() {
  return (
    <div>
    <Navbar expand="lg" className="navbar-container ">
    <Container>
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
      <div>
    <Link to="/" className="logo mx-auto">
          <img height={'30px'} src={me} alt="Logo" className="logo-img" />
        </Link>
  </div>
        <Nav className=" d-flex mx-auto align-items-center">
          <Nav.Link as={Link} to="/atlas" style={{color:'#272727'}} className="nav-items">
            Atlas
          </Nav.Link>
          <Nav.Link as={Link} to="/blog" style={{color:'#272727'}}  className="nav-items">
            Blog
          </Nav.Link>
          <Nav.Link as={Link} to="/scribble" style={{color:'#272727'}}  className="nav-items">
            Scribble
          </Nav.Link>
        </Nav>
       <Link to={"/contact"} style={{textDecoration:'none'}}>
          <div className="ms-auto d-flex justify-content-center pe-5">
            <button className="contact-btn">Contact</button>
          </div>
       </Link>
      </Navbar.Collapse>
    </Container>
  </Navbar>
 

</div>
  )
}

export default Header
