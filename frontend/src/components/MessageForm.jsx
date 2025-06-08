import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:3000/api/v1/message/send",
          { firstName, lastName, email, phone, message },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setMessage("");
        });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <div className="container form-component message-form">
        <h2>Send Us A Message</h2>
        <form onSubmit={handleMessage}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <textarea
            rows={7}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Send</button>
          </div>
        </form>

        {/* Hospital Cards Section */}
        <h2 className="hospital-list-heading">Hospitals in Chhatrapati Sambhaji Nagar</h2>
        <div className="hospital-info-list">
          <a href="https://www.carehospitals.com/aurangabad/" target="_blank" rel="noopener noreferrer" className="hospital-info-card">
            <img src="/hospital1.jpg" alt="Care Hospitals" />
            <span>Care Hospitals</span>
          </a>
          <a href="https://www.medicoverhospitals.in/locations/maharashtra/aurangabad/" target="_blank" rel="noopener noreferrer" className="hospital-info-card">
            <img src="/hospital2.jpg" alt="Medicover Hospitals" />
            <span>Medicover Hospitals</span>
          </a>
          <a href="https://www.mgmmedicalcollege.org/" target="_blank" rel="noopener noreferrer" className="hospital-info-card">
            <img src="/hospital3.jpg" alt="MGM Medical College & Hospital" />
            <span>MGM Medical College & Hospital</span>
          </a>
          <a href="https://www.kamalnayanbajajhospital.org/" target="_blank" rel="noopener noreferrer" className="hospital-info-card">
            <img src="/hospital4.jpg" alt="Kamalnayan Bajaj Hospital" />
            <span>Kamalnayan Bajaj Hospital</span>
          </a>
          <a href="https://www.manikchandhospital.com/" target="_blank" rel="noopener noreferrer" className="hospital-info-card">
            <img src="/hospital5.jpg" alt="Manikchand Hospital" />
            <span>Manikchand Hospital</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default MessageForm;