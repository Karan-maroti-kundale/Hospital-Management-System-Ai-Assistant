import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError("Authentication required");
          return;
        }

        const { data } = await axios.get(
          "http://localhost:3000/api/v1/message/getall",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (data.success) {
          setMessages(data.data || []);
        } else {
          setError(data.message);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.response?.data?.message || "Failed to fetch messages");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <section className="page messages">
        <div className="loading">
          <p>Loading messages...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page messages">
        <div className="error">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page messages">
      <h1>MESSAGES</h1>
      <div className="banner">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div className="card" key={message._id}>
              <div className="details">
                <p>
                  First Name: <span>{message.firstName}</span>
                </p>
                <p>
                  Last Name: <span>{message.lastName}</span>
                </p>
                <p>
                  Email: <span>{message.email}</span>
                </p>
                <p>
                  Phone: <span>{message.phone}</span>
                </p>
                <p>
                  Message: <span>{message.message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h1>No Messages!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;
