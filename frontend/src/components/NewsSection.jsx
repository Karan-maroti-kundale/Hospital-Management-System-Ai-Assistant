import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/v1/news"; // Replace with your real API endpoint

const NewsSection = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then((data) => {
        setNewsList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section style={{ background: "#f9f9f9", padding: "2rem 0" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ color: "#1976d2", marginBottom: "1.5rem" }}>Latest News & Announcements</h2>
        {loading && <p>Loading news...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {newsList.map((news) => (
            <li
              key={news.id}
              style={{
                background: "#fff",
                marginBottom: "1rem",
                padding: "1rem 1.5rem",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: "0.95rem", color: "#888" }}>
                {new Date(news.date).toLocaleDateString()}
              </div>
              <h3 style={{ margin: "0.5rem 0" }}>{news.title}</h3>
              <p style={{ margin: "0.5rem 0" }}>{news.description}</p>
              <a
                href={news.link}
                style={{ color: "#1976d2", textDecoration: "underline" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </a>
            </li>
          ))}
        </ul>
        {!loading && newsList.length === 0 && <p>No news available at the moment.</p>}
      </div>
    </section>
  );
};

export default NewsSection;