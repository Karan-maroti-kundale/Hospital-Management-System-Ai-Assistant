import { useState } from "react";

const testimonials = [
    {
        name: "Anjali Sharma",
        photo: "/user1.jpg",
        rating: 5,
        date: "May 2024",
        text: "The doctors and staff were extremely caring and professional. The facilities are top-notch. Highly recommended!",
    },
    {
        name: "Vikram Deshmukh",
        photo: "/user2.jpg",
        rating: 4,
        date: "April 2024",
        text: "Clean hospital, quick service, and the pediatric department is excellent. Thank you for the support!",
    },
    {
        name: "Rahul Patil",
        photo: "/user3.jpg",
        rating: 5,
        date: "March 2024",
        text: "I was admitted for surgery and the care I received was outstanding. The doctors explained everything clearly.",
    },
    {
        name: "Sneha Kulkarni",
        photo: "/user4.jpg",
        rating: 4,
        date: "February 2024",
        text: "Emergency team responded quickly and efficiently. The hospital is well-equipped and staff is friendly.",
    },
];

const Testimonials = () => {
    const [current, setCurrent] = useState(0);

    const nextTestimonial = () => setCurrent((current + 1) % testimonials.length);
    const prevTestimonial = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="testimonials-section">
            <h2 className="testimonials-title">What Our Patients Say</h2>
            <div className="testimonial-card">
                <img className="testimonial-photo" src={testimonials[current].photo} alt={testimonials[current].name} />
                <div className="testimonial-content">
                    <div className="testimonial-header">
                        <span className="testimonial-name">{testimonials[current].name}</span>
                        <span className="testimonial-date">{testimonials[current].date}</span>
                    </div>
                    <div className="testimonial-rating">
                        {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                            <span key={i} style={{ color: "#FFD700", fontSize: "1.1em" }}>★</span>
                        ))}
                        {Array.from({ length: 5 - testimonials[current].rating }).map((_, i) => (
                            <span key={i} style={{ color: "#ddd", fontSize: "1.1em" }}>★</span>
                        ))}
                    </div>
                    <p className="testimonial-text">{testimonials[current].text}</p>
                </div>
                <div className="testimonial-nav">
                    <button onClick={prevTestimonial} aria-label="Previous testimonial">‹</button>
                    <button onClick={nextTestimonial} aria-label="Next testimonial">›</button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;