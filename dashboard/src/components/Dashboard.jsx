import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError("Authentication required");
          return;
        }

        const [appointmentsRes, doctorsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/appointment/getall", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get("http://localhost:3000/api/v1/user/doctors", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        if (appointmentsRes.data.success) {
          setAppointments(appointmentsRes.data.data || []);
        } else {
          setError(appointmentsRes.data.message);
          setAppointments([]);
        }

        if (doctorsRes.data.success) {
          setDoctors(doctorsRes.data.data || []);
        } else {
          setError(doctorsRes.data.message);
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to fetch data");
        setAppointments([]);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const { data } = await axios.put(
        `http://localhost:3000/api/v1/appointment/update/${appointmentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status }
              : appointment
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error(error.response?.data?.message || "Failed to update appointment status");
    }
  };

  // Show loading spinner or redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <section className="dashboard page">
        <div className="loading">
          <p>Loading dashboard...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard page">
        <div className="error">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello,</p>
                <h5>
                  {admin && `${admin.firstName} ${admin.lastName}`}
                </h5>
              </div>
              <p className="dashboard-welcome">
                Welcome to the Admin Dashboard! Here you can manage all the appointments, doctors, and patients efficiently.
                Use the navigation menu to access different sections and perform actions like adding new doctors or managing appointments.
                If you have any questions or need assistance, feel free to reach out to the support team.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{doctors.length}</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date?.substring(0, 16) || "N/A"}</td>
                    <td>
                      {appointment.doctor
                        ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                        : "N/A"
                      }
                    </td>
                    <td>{appointment.department?.name || "N/A"}</td>
                    <td>
                      <select
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                        }
                        value={appointment.status || "Pending"}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>
                        <option value="Accepted" className="value-accepted">
                          Accepted
                        </option>
                        <option value="Rejected" className="value-rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td>
                      {appointment.hasVisited === true ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No Appointments Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;