import { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        setAdmin({});
        navigateTo("/login");
        return;
      }

      await axios.get("http://localhost:3000/api/v1/user/logout", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear token and state
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setAdmin({});
      
      toast.success("Logged out successfully");
      navigateTo("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
      // Still clear local state even if server request fails
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setAdmin({});
      navigateTo("/login");
    }
  };

  // Don't show sidebar on login page or if not authenticated
  if (!isAuthenticated || location.pathname === "/login") return null;

  return (
    <>
      <nav className={show ? "show sidebar" : "sidebar"}>
        <div className="links">
          <Link to="/">
            <TiHome title="Dashboard Home" />
          </Link>
          <Link to="doctors">
            <FaUserDoctor title="Doctors" />
          </Link>
          <Link to="admin/addnew">
            <MdAddModerator title="Add New Admin" />
          </Link>
          <Link to="doctor/addnew">
            <IoPersonAddSharp title="Add New Doctor" />
          </Link>
          <Link to="messages">
            <AiFillMessage title="Messages" />
          </Link>
          <RiLogoutBoxFill onClick={handleLogout} title="Logout" style={{ cursor: "pointer" }} />
        </div>
      </nav>
      <div className="wrapper">
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
