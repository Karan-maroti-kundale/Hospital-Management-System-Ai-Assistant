import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Context } from "../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/patient/logout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="container navbar-custom">
      <Link to="/" className="logo d-flex align-items-center">
        <img src="/logo.png" alt="Hospital Logo" className="logo-img" />
      </Link>

      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link to="/" onClick={() => setShow(false)}>
            Home
          </Link>
          <Link to="/appointment" onClick={() => setShow(false)}>
            Appointment
          </Link>
          <Link to="/about" onClick={() => setShow(false)}>
            About Us
          </Link>
        </div>

        {isAuthenticated ? (
          <button className="logoutBtn btn" onClick={handleLogout}>
            LOGOUT
          </button>
        ) : (
          <button className="loginBtn btn" onClick={goToLogin}>
            LOGIN
          </button>
        )}
      </div>

      <div
        className="hamburger"
        onClick={() => setShow((prev) => !prev)}
        aria-label="Toggle navigation menu"
        role="button"
      >
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
