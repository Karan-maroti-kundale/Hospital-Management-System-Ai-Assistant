import { useLocation, useNavigate } from 'react-router-dom';
// import HospitalSearchBar from './HospitalSearchBar';
import { FaHome, FaHospital, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { useContext } from 'react';
import { Context } from '../main';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
                withCredentials: true,
            });
            toast.success(res.data.message);
            setIsAuthenticated(false);
            setUser({});
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
            toast.error(err.response?.data?.message || "Logout failed");
            // Force logout even if server request fails
            setIsAuthenticated(false);
            setUser({});
            navigate("/login");
        }
    };

    return (
        <header className="main-header">
            <div className="header-container">
                {/* Logo and Title */}
                <div className="logo-title" onClick={() => handleNavigation('/')}>
                    <img src="/logo.png" alt="Hospital Logo" className="logo-img" />
                    <span className="logo-text">VitaSphere</span>
                </div>

                {/* Navigation Links */}
                <div className="nav-items">
                    <div
                        className={`nav-link-custom ${location.pathname === '/' ? 'active-nav' : ''}`}
                        onClick={() => handleNavigation('/')}
                    >
                        <FaHome className="me-1 mb-1" />
                        Home
                    </div>

                    <div
                        className={`nav-link-custom ${location.pathname === '/smart-hospital-guide' ? 'active-nav' : ''}`}
                        onClick={() => handleNavigation('/smart-hospital-guide')}
                    >
                        <FaHospital className="me-1 mb-1" />
                        SmartHospitalGuide
                    </div>

                    <div
                        className={`nav-link-custom ${location.pathname === '/appointment' ? 'active-nav' : ''}`}
                        onClick={() => handleNavigation('/appointment')}
                    >
                        <FaCalendarAlt className="me-1 mb-1" />
                        Appointment
                    </div>

                    <div
                        className={`nav-link-custom ${location.pathname === '/about' ? 'active-nav' : ''}`}
                        onClick={() => handleNavigation('/about')}
                    >
                        <FaInfoCircle className="me-1 mb-1" />
                        About Us
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-spacer" />

                {/* Login Only */}
                <div className="auth-search">
                    {isAuthenticated ? (
                        <button
                            className="btn btn-dark login-btn"
                            onClick={handleLogout}
                        >
                            LOGOUT
                        </button>
                    ) : (
                        <button
                            className="btn btn-dark login-btn"
                            onClick={() => handleNavigation('/login')}
                        >
                            LOGIN
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
