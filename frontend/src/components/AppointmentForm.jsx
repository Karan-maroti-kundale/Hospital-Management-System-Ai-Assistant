import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";

const AppointmentForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    appointmentDate: "",
    department: "",
    doctorFirstName: "",
    doctorLastName: "",
    doctorId: "",
    address: "",
    hasVisited: false,
  });

  const [departments] = useState([
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "General Medicine",
    "Radiology",
    "Gynecology",
    "Ophthalmology",
    "ENT",
    "Psychiatry"
  ]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(Context);
  const navigate = useNavigate();

  // Function to check authentication
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      setIsAuthenticated(false);
      setUser({});
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!checkAuth()) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/user/doctors",
          { 
            withCredentials: true,
            headers: { 
              "Authorization": `Bearer ${token}`
            }
          }
        );
        if (data && data.data) {
          setDoctors(data.data);
        } else {
          setDoctors([]);
          console.error("Invalid response format:", data);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setUser({});
          toast.error("Please login to book an appointment");
          navigate("/login");
        } else {
          toast.error("Failed to load doctors");
        }
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [navigate, setIsAuthenticated, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkAuth()) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    // Validation
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.nic ||
      !form.dob ||
      !form.gender ||
      !form.appointmentDate ||
      !form.department ||
      !form.doctorFirstName ||
      !form.doctorLastName ||
      !form.doctorId ||
      !form.address
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/appointment/post",
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          nic: form.nic,
          dob: form.dob,
          gender: form.gender,
          appointment_date: form.appointmentDate,
          department: form.department,
          doctor_firstName: form.doctorFirstName,
          doctor_lastName: form.doctorLastName,
          doctorId: form.doctorId,
          address: form.address,
          hasVisited: Boolean(form.hasVisited)
        },
        {
          withCredentials: true,
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      
      toast.success(data.message);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nic: "",
        dob: "",
        gender: "",
        appointmentDate: "",
        department: "",
        doctorFirstName: "",
        doctorLastName: "",
        doctorId: "",
        address: "",
        hasVisited: false,
      });
    } catch (error) {
      console.error("Appointment submission error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser({});
        toast.error("Please login to book an appointment");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to book appointment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDoctorChange = (e) => {
    try {
      const { firstName, lastName, _id } = JSON.parse(e.target.value);
      setForm((prev) => ({
        ...prev,
        doctorFirstName: firstName,
        doctorLastName: lastName,
        doctorId: _id
      }));
    } catch (error) {
      console.error("Error parsing doctor data:", error);
      toast.error("Error selecting doctor. Please try again.");
    }
  };

  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    setForm((prev) => ({
      ...prev,
      department: selectedDept,
      doctorFirstName: "",
      doctorLastName: "",
      doctorId: "",
    }));
  };

  const getFilteredDoctors = () => {
    if (!form.department) return [];
    
    return doctors.filter(doctor => {
      // Normalize department names for comparison
      const doctorDept = (doctor.doctorDepartment || '').toLowerCase().trim();
      const selectedDept = form.department.toLowerCase().trim();
      
      return doctorDept === selectedDept;
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container form-component appointment-form" style={{
      maxWidth: 600,
      margin: "40px auto",
      background: "#fff",
      borderRadius: "18px",
      boxShadow: "0 4px 32px rgba(39,23,118,0.10)",
      padding: "2.5rem 2rem",
      position: "relative",
      zIndex: 1
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1976d2" }}>Book an Appointment</h2>

      {/* DEBUG INFO - Remove this in production */}
      <div style={{ background: "#f5f5f5", padding: "10px", marginBottom: "20px", fontSize: "12px" }}>
        <strong>🐛 DEBUG INFO:</strong><br />
        Total Doctors: {doctors.length}<br />
        Selected Department: {form.department}<br />
        Filtered Doctors: {getFilteredDoctors().length}<br />
        {getFilteredDoctors().length > 0 && (
          <>Available: {getFilteredDoctors().map(d => `Dr. ${d.firstName} ${d.lastName}`).join(', ')}</>
        )}
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            value={form.firstName}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name*"
            value={form.lastName}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number*"
            value={form.phone}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
            pattern="[0-9]{10,15}"
            title="Please enter a valid phone number"
          />
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="nic" style={{ fontWeight: 600, marginBottom: 4 }}>
              NIC*
            </label>
            <input
              type="text"
              id="nic"
              name="nic"
              placeholder="NIC*"
              value={form.nic}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="dob" style={{ fontWeight: 600, marginBottom: 4 }}>
              Date of Birth*
              <span title="Please enter your birth date for age verification" style={{ marginLeft: 6, color: "#1976d2", cursor: "help" }}>🛈</span>
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              placeholder="Date of Birth*"
              value={form.dob}
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]}
              style={{ width: "100%" }}
            />
            <span style={{ fontSize: "0.95rem", color: "#888" }}>
              (You must be at least 1 year old)
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="gender" style={{ fontWeight: 600, marginBottom: 4 }}>
              Gender*
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            >
              <option value="">Select Gender*</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label htmlFor="appointmentDate" style={{ fontWeight: 600, marginBottom: 4 }}>
              Appointment Date*
              <span title="Choose your preferred appointment date" style={{ marginLeft: 6, color: "#1976d2", cursor: "help" }}>🛈</span>
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              placeholder="Appointment Date*"
              value={form.appointmentDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              style={{ width: "100%" }}
            />
            <span style={{ fontSize: "0.95rem", color: "#888" }}>
              (Only today or future dates allowed)
            </span>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="department" style={{ fontWeight: 600, marginBottom: 4, display: "block" }}>
            Department*
          </label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleDepartmentChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="doctor" style={{ fontWeight: 600, marginBottom: 4, display: "block" }}>
            Doctor*
          </label>
          <select
            id="doctor"
            name="doctor"
            onChange={handleDoctorChange}
            required
            disabled={!form.department || getFilteredDoctors().length === 0}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Select a doctor</option>
            {getFilteredDoctors().map((doctor) => (
              <option key={doctor._id} value={JSON.stringify({ 
                firstName: doctor.firstName, 
                lastName: doctor.lastName,
                _id: doctor._id 
              })}>
                Dr. {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
          {form.department && getFilteredDoctors().length === 0 && (
            <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "4px" }}>
              No doctors available in this department
            </p>
          )}
        </div>
        <textarea
          name="address"
          rows="4"
          value={form.address}
          onChange={handleChange}
          placeholder="Address*"
          required
          style={{ width: "100%", marginBottom: 16 }}
        />
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: 20,
        }}>
          <input
            type="checkbox"
            name="hasVisited"
            checked={form.hasVisited}
            onChange={handleChange}
            style={{ width: "18px", height: "18px" }}
            id="hasVisited"
          />
          <label htmlFor="hasVisited" style={{ marginBottom: 0, fontSize: "1.05rem" }}>
            Have you visited before?
          </label>
        </div>
        <button
          type="submit"
          className="btn"
          style={{
            width: "100%",
            fontSize: "1.18rem",
            padding: "14px 0",
            borderRadius: "10px",
            background: loading ? "#bdbdbd" : undefined,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Booking..." : "GET APPOINTMENT"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;