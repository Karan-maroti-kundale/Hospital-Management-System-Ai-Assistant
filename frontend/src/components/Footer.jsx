import { Link } from "react-router-dom";
import {
  FaLocationArrow,
  FaPhone,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const hours = [
  { id: 1, day: "Monday", time: "9:00 AM - 8:00 PM" },
  { id: 2, day: "Tuesday", time: "9:00 AM - 8:00 PM" },
  { id: 3, day: "Wednesday", time: "9:00 AM - 8:00 PM" },
  { id: 4, day: "Thursday", time: "9:00 AM - 8:00 PM" },
  { id: 5, day: "Friday", time: "9:00 AM - 8:00 PM" },
  { id: 6, day: "Saturday", time: "9:00 AM - 5:00 PM" },
  { id: 7, day: "Sunday", time: "Emergency Only" },
];

const Footer = () => (
  <footer className="footer-advanced">
    <div className="footer-content">
      {/* Logo & Tagline */}
      <div className="footer-col">
        <img
          src="/logo.png"
          alt="VitaSphere Hospital Logo"
          className="footer-logo"
        />
        <p className="footer-title">VitaSphere Hospital</p>
        <p className="footer-tagline">
          Excellence in Healthcare.
          <br />
          Your health, our mission.
        </p>
        <div className="footer-socials">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/918010407897"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
      {/* Quick Links */}
      <div className="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/appointment">Appointment</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
      {/* Opening Hours */}
      <div className="footer-col">
        <h4>Opening Hours</h4>
        <ul>
          {hours.map((element) => (
            <li key={element.id}>
              <span>{element.day}</span>
              <span>{element.time}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Contact Info */}
      <div className="footer-col">
        <h4>Contact Us</h4>
        <div className="footer-contact">
          <FaLocationArrow />
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
            123 Hospital Street, Medical District
          </a>
        </div>
        <div className="footer-contact">
          <FaPhone />
          <a href="tel:+918010407897">+91 8010407897</a>
        </div>
        <div className="footer-contact">
          <MdEmail />
          <a href="mailto:contact@vitasphere.com">contact@vitasphere.com</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; {new Date().getFullYear()} VitaSphere Hospital. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
