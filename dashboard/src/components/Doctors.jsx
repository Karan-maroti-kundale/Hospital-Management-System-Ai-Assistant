import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          toast.error("Please login to access this resource");
          return;
        }

        const { data } = await axios.get(
          "http://localhost:3000/api/v1/user/doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (data.success) {
          setDoctors(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      }
    };

    if (isAuthenticated) {
      fetchDoctors();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="card" key={doctor._id}>
              <img
                src={doctor.docAvatar?.url || "/default-avatar.png"}
                alt="doctor avatar"
              />
              <h4>{`${doctor.firstName} ${doctor.lastName}`}</h4>
              <div className="details">
                <p>
                  Email: <span>{doctor.email}</span>
                </p>
                <p>
                  Phone: <span>{doctor.phone}</span>
                </p>
                <p>
                  DOB: <span>{doctor.dob?.substring(0, 10)}</span>
                </p>
                <p>
                  Department: <span>{doctor.department?.name || "Not assigned"}</span>
                </p>
                <p>
                  NIC: <span>{doctor.nic}</span>
                </p>
                <p>
                  Gender: <span>{doctor.gender}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Doctors;
