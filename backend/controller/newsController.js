export const getAllNews = (req, res) => {
  // Example static news data
  const newsList = [
    {
      id: 1,
      title: "Hospital Launches New Cardiology Wing",
      description: "Our new cardiology wing is now open to serve patients with state-of-the-art facilities.",
      date: "2024-05-25",
      link: "https://yourhospital.com/news/cardiology-wing"
    },
    {
      id: 2,
      title: "Free Health Camp on June 10th",
      description: "Join our free health camp for general checkups and consultations.",
      date: "2024-05-20",
      link: "https://yourhospital.com/news/health-camp"
    }
  ];

  res.status(200).json(newsList);
};