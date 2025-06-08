import PropTypes from "prop-types";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container" style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2.5rem",
        padding: "2.5rem 0"
      }}>
        <div className="banner" style={{ flex: "1 1 420px", minWidth: 280 }}>
          <h1 style={{ color: "#271776", fontWeight: 800, fontSize: "2.6rem", marginBottom: 18 }}>
            {title}
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#444", marginBottom: 24 }}>
            <strong>Chhatrapati Sambhaji Nagar Hospital</strong> is Marathwada’s trusted destination for advanced, compassionate healthcare. Our NABH-accredited, multi-specialty facility offers 24/7 emergency care, modern diagnostics, and a team of expert doctors dedicated to your well-being.
            <br /><br />
            Located on Jalna Road, we serve Aurangabad and the region with personalized treatment, state-of-the-art technology, and a patient-first approach. Your health, comfort, and recovery are our highest priorities.
          </p>
        </div>
        <div className="banner" style={{ flex: "1 1 380px", minWidth: 260, textAlign: "center" }}>
          <img
            src={imageUrl}
            alt="Chhatrapati Sambhaji Nagar Hospital"
            className="animated-image"
            style={{
              width: "100%",
              maxWidth: 480,
              borderRadius: "36px 36px 0 0 / 80px 80px 0 0",
              boxShadow: "0 8px 32px rgba(39,23,118,0.10)",
              objectFit: "cover",
              margin: "0 auto",
              background: "#f5f7fa",
              border: "none"
            }}
          />
          <span>
            <img src="/Vector.png" alt="vector" style={{ width: 120, marginTop: -24 }} />
          </span>
        </div>
      </div>
    </>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default Hero;