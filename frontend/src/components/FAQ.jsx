import { useState } from "react";

const faqs = [
    {
        question: "What are your visiting hours?",
        answer: "Our visiting hours are from 10:00 AM to 8:00 PM every day. Please check with the nurse station for any special restrictions.",
    },
    {
        question: "How can I book an appointment?",
        answer: "You can book an appointment online through our website, by calling our reception, or by visiting the hospital in person.",
    },
    {
        question: "Do you accept health insurance?",
        answer: "Yes, we accept most major health insurance providers. Please bring your insurance card and ID during your visit.",
    },
    {
        question: "Where is the emergency department located?",
        answer: "The emergency department is located at the main entrance of the hospital and is open 24/7 for all emergencies.",
    },
    {
        question: "How do I get my medical reports?",
        answer: "Medical reports can be collected from the records department or accessed online through our patient portal.",
    },
    {
        question: "What specialties are available at your hospital?",
        answer: "We offer Cardiology, Neurology, Pediatrics, Oncology, Orthopedics, ENT, Dermatology, Nephrology, Dental, Urology, Radiology, and more.",
    },
    {
        question: "Is there parking available for visitors?",
        answer: "Yes, we have ample parking space available for patients and visitors, including accessible parking spots.",
    },
    {
        question: "How can I contact the hospital for general inquiries?",
        answer: "You can call our main reception at +91 240 662 5555 or email us at info@hospital.com.",
    },
    {
        question: "Are there cafeteria or food services for patients and visitors?",
        answer: "Yes, our hospital has a cafeteria that serves healthy meals and snacks for both patients and visitors.",
    },
    {
        question: "Do you provide ambulance services?",
        answer: "Yes, we offer 24/7 ambulance services. Please call our emergency number for immediate assistance.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section className="faq-section">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <div className="faq-list">
                {faqs.map((faq, idx) => (
                    <div className={`faq-item${openIndex === idx ? " open" : ""}`} key={idx}>
                        <button
                            className="faq-question"
                            onClick={() => toggleFAQ(idx)}
                            aria-expanded={openIndex === idx}
                            aria-controls={`faq-answer-${idx}`}
                        >
                            {faq.question}
                            <span className="faq-toggle">{openIndex === idx ? "−" : "+"}</span>
                        </button>
                        <div
                            className="faq-answer"
                            id={`faq-answer-${idx}`}
                            style={{
                                maxHeight: openIndex === idx ? "200px" : "0",
                                opacity: openIndex === idx ? 1 : 0,
                                transition: "max-height 0.3s ease, opacity 0.3s ease",
                                overflow: "hidden",
                            }}
                        >
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;