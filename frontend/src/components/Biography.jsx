import PropTypes from "prop-types";

const Biography = ({ imageUrl }) => {
  return (
    <div className="container biography" style={{ display: "flex", gap: "2.5rem", alignItems: "center", flexWrap: "wrap", marginTop: "2rem", marginBottom: "2rem" }}>
      <div className="banner" style={{ flex: "1 1 320px", minWidth: 260 }}>
        <img
          src={imageUrl}
          alt="About Chhatrapati Sambhaji Nagar Hospital"
          style={{
            width: "100%",
            borderRadius: "18px",
            boxShadow: "0 4px 24px rgba(39,23,118,0.10)",
            objectFit: "cover",
            minHeight: 220,
            maxHeight: 340,
          }}
        />
      </div>
      <div className="banner" style={{ flex: "2 1 400px", minWidth: 260 }}>
        <h3 style={{ color: "#1976d2", fontWeight: 800, marginBottom: 16 }}>Who We Are</h3>
        <p style={{ marginBottom: 12 }}>
          <strong>Chhatrapati Sambhaji Nagar Hospital</strong> is a premier multi-specialty healthcare institution serving Aurangabad and the Marathwada region. Our mission is to deliver world-class medical care with compassion, innovation, and integrity.
        </p>
        <p style={{ marginBottom: 12 }}>
          We offer a comprehensive range of specialties including Cardiology, Neurology, Pediatrics, Orthopedics, Oncology, and more. Our hospital is equipped with state-of-the-art technology, modern infrastructure, and a team of highly experienced doctors and healthcare professionals.
        </p>
        <p style={{ marginBottom: 12 }}>
          Located in the heart of Chhatrapati Sambhaji Nagar, we are dedicated to providing patient-centric care, 24/7 emergency services, and advanced diagnostic facilities. We believe in continuous improvement, community outreach, and ethical medical practices.
        </p>
        <ul style={{ margin: "1rem 0 1.5rem 1.2rem", color: "#444", fontSize: "1.08rem" }}>
          <li>✔️ NABH-accredited hospital</li>
          <li>✔️ 24/7 Emergency & Trauma Care</li>
          <li>✔️ Advanced ICU & Surgical Units</li>
          <li>✔️ Compassionate, multilingual staff</li>
        </ul>
        <p style={{ color: "#271776", fontWeight: 600 }}>
          Your health and well-being are our top priorities. Thank you for trusting Chhatrapati Sambhaji Nagar Hospital as your healthcare partner.
        </p>
      </div>
    </div>
  );
};

Biography.propTypes = {
  imageUrl: PropTypes.string.isRequired,
};

export default Biography;