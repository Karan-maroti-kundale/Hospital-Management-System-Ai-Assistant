import Hero from "../components/Hero";
import Biography from "../components/Biography";
import MessageForm from "../components/MessageForm";
import Departments from "../components/Departments";
import NewsSection from "../components/NewsSection";
import EmergencyContacts from "../components/EmergencyContacts";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import AIHealthAssistant from "../components/AIHealthAssistant";
import HospitalSearchBar from "../components/HospitalSearchBar";

const Home = () => {
  return (
    <div className="main-content">
      <NewsSection />
      <Hero
        title="Welcome to VitaSphere Hospital"
        imageUrl="/hero.png"
        subtitle="Your trusted multi-specialty hospital. 24/7 emergency care, advanced diagnostics, and compassionate experts—your health, our mission."
      />
      <HospitalSearchBar />
      <Biography
        imageUrl="/about.png"
        title="About Us"
        description="VitaSphere Hospital delivers world-class healthcare with a patient-first approach. Our facility offers modern technology, experienced doctors, and personalized care for every patient."
      />
      <Testimonials />
      <Departments
        title="Our Departments"
        description="Explore our specialties—from Cardiology and Neurology to Pediatrics and Oncology. Each department is staffed by leading experts dedicated to your well-being."
      />
      <EmergencyContacts
        title="Emergency? We're Here 24/7"
        description="Call our emergency team anytime for immediate assistance. Your safety is our top priority."
      />
      <FAQ />
      <MessageForm
        title="Need Help or Have a Question?"
        description="Send us a message and our team will respond promptly to assist you."
      />
    </div>
  );
};

export default Home;