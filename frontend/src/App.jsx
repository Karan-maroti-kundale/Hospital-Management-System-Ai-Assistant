import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import './app.css';
import { Context } from './main';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import AboutUs from './pages/AboutUs';
import Register from './pages/Register';
import Login from './pages/Login';
import SmartHospitalGuide from './pages/SmartHospitalGuide';
import AIHealthAssistant from './components/AIHealthAssistant';

function App() {
  const { isAuthenticated } = useContext(Context);

  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/smart-hospital-guide" element={<SmartHospitalGuide />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <AIHealthAssistant />
      <Footer />
    </div>
  );
}

export default App;

