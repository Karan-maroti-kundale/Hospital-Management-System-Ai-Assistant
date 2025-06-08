import Hero from "../components/Hero";
import { FaUserMd, FaHeartbeat, FaRegClock, FaUsers } from "react-icons/fa";

const AboutUs = () => {
  return (
    <>
      <Hero
        title="About Us"
        imageUrl="/about.png"
        subtitle="Empowering Healthcare with Compassion and Innovation"
        overlay={true}
      />

      <section className="about-advanced">
        {/* Mission & Vision */}
        <div className="mission-vision">
          <div className="card mission">
            <h2>Our Mission</h2>
            <p>
              To provide accessible, high-quality healthcare for all, using the latest technology and a patient-first approach.
            </p>
          </div>
          <div className="card vision">
            <h2>Our Vision</h2>
            <p>
              To be a leader in digital healthcare, making a positive impact on communities and setting new standards in patient care.
            </p>
          </div>
        </div>

        {/* Quick Stats with Icons */}
        <div className="about-stats">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <h3>10,000+</h3>
            <p>Patients Served</p>
          </div>
          <div className="stat-card">
            <FaUserMd className="stat-icon" />
            <h3>50+</h3>
            <p>Expert Doctors</p>
          </div>
          <div className="stat-card">
            <FaRegClock className="stat-icon" />
            <h3>24/7</h3>
            <p>Support</p>
          </div>
          <div className="stat-card">
            <FaHeartbeat className="stat-icon" />
            <h3>99%</h3>
            <p>Patient Satisfaction</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;