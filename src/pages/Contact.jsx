import React from 'react'
import "../styles/contact.css"
import Header from '../components/Header'
import { Button, FloatingLabel, Form } from 'react-bootstrap'
import Footer from "../components/Footer";

function Contact() {
  return (
    <div className="contact-section">
     <Header/>
     <div className='contact'>
       <h2>Get In Touch</h2>
       <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate amet harum consequatur. Quisquam, nobis. </p>

       <div className="contact-container"> 
  <div className="contact-left">
    <h3>Contact Information</h3>
    <p><i className="fa-solid fa-phone"></i> +91 9037194425</p>
    <p><i className="fa-solid fa-envelope"></i> support@email.com</p>
    <p><i className="fa-solid fa-location-dot"></i> Thrissur, Kerala</p>
  </div>

  <div className="contact-right">
    <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
      <Form.Control type="text" placeholder="Enter your name" />
    </FloatingLabel>

    <FloatingLabel controlId="floatingEmail" label="Email address" className="mb-3">
      <Form.Control type="email" placeholder="name@example.com" />
    </FloatingLabel>

    <FloatingLabel controlId="floatingSubject" label="Subject" className="mb-3">
      <Form.Control type="text" placeholder="Subject" />
    </FloatingLabel>

    <FloatingLabel controlId="floatingTextarea2" label="Message">
      <Form.Control as="textarea" placeholder="Leave a message" style={{ height: '100px' }} />
    </FloatingLabel>

    <button className='contact-button'>Send Message</button>
  </div>
</div>

     </div>
     <Footer className="fixed-bottom"/>
    </div>
  )
}

export default Contact
