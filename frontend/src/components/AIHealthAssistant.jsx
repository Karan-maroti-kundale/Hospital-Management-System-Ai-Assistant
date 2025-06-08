import { useState, useEffect } from "react";

const AIHealthAssistant = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! I am your AI Health Assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blink effect controlled by useEffect
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink((prev) => !prev);
        }, 700);
        return () => clearInterval(interval); // Clean up interval on unmount
    }, []);

    // Function to detect if user input contains medical/health-related keywords
    const isMedicalQuery = (text) => {
        const medicalKeywords = [
            "pain",
            "fever",
            "headache",
            "symptoms",
            "sick",
            "hurt",
            "ache",
            "temperature",
            "nausea",
            "dizzy",
            "tired",
            "fatigue",
            "cough",
            "cold",
            "flu",
            "infection",
            "rash",
            "swelling",
            "bleeding",
            "vomiting",
            "diarrhea",
            "chest pain",
            "shortness of breath",
            "abdominal pain",
            "back pain",
            "joint pain",
            "muscle pain",
            "sore throat",
            "runny nose",
            "congestion",
            "allergy",
            "allergic",
            "medication",
            "medicine",
            "pills",
            "treatment",
            "diagnosis",
            "doctor",
            "hospital",
            "emergency",
            "urgent",
            "medical history",
            "blood pressure",
            "diabetes",
            "heart rate",
            "pulse",
            "weight loss",
            "weight gain",
            "appetite",
            "sleep",
            "insomnia",
            "anxiety",
            "depression",
            "stress",
            "mental health",
            "injury",
            "wound",
            "burn",
            "cut",
            "bruise",
            "fracture",
            "sprain",
            "strain",
        ];

        const lowerText = text.toLowerCase();
        return medicalKeywords.some((keyword) => lowerText.includes(keyword));
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        const userInput = input;
        setInput("");
        setLoading(true);

        try {
            const isMedical = isMedicalQuery(userInput);
            const endpoint = isMedical
                ? "http://localhost:3000/api/v1/ai/analyze-stream"
                : "http://localhost:3000/api/v1/ai/chat-stream";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [isMedical ? "medicalData" : "prompt"]: userInput,
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let aiReply = "";

            // Append an empty assistant message for streaming
            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            const read = async () => {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    aiReply += chunk;

                    // Update assistant message with new chunk
                    setMessages((prev) => {
                        const updated = [...prev];
                        const lastIndex = updated.length - 1;
                        updated[lastIndex] = {
                            role: "assistant",
                            content: aiReply,
                        };
                        return updated;
                    });
                }

                if (isMedical) {
                    aiReply += "\n\n⚠️ **Disclaimer**: This is AI-generated information for educational purposes only. Always consult a healthcare professional.";
                    setMessages((prev) => {
                        const updated = [...prev];
                        const lastIndex = updated.length - 1;
                        updated[lastIndex] = {
                            role: "assistant",
                            content: aiReply,
                        };
                        return updated;
                    });
                }

                setLoading(false);
            };

            read();

        } catch (err) {
            console.error("Streaming error:", err);
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: "❌ Sorry, an error occurred while processing your message. Please try again.",
                },
            ]);
            setLoading(false);
        }
    };


    // Function to clear chat history
    const clearChat = () => {
        setMessages([
            {
                role: "assistant",
                content: "Hi! I am your AI Health Assistant. How can I help you today?",
            },
        ]);
    };

    return (
        <>
            <div
                className={`ai-assistant-fab${blink ? " blink" : ""}`}
                onClick={() => setOpen((o) => !o)}
                title="AI Health Assistant"
            >
                <span role="img" aria-label="AI">
                    🤖
                </span>
            </div>
            {open && (
                <div className="ai-assistant-chatbox">
                    <div className="ai-assistant-header">
                        <span>AI Health Assistant</span>
                        <div className="ai-assistant-header-buttons">
                            <button
                                onClick={clearChat}
                                title="Clear Chat"
                                className="ai-clear-btn"
                            >
                                🗑️
                            </button>
                            <button onClick={() => setOpen(false)}>×</button>
                        </div>
                    </div>
                    <div className="ai-assistant-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`ai-msg ai-msg-${msg.role}`}>
                                <div className="ai-msg-content">
                                    {msg.content.split("\n").map((line, lineIdx) => (
                                        <div key={lineIdx}>
                                            {line}
                                            {lineIdx < msg.content.split("\n").length - 1 && <br />}
                                        </div>
                                    ))}
                                </div>
                                <div className="ai-msg-timestamp">
                                    {new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="ai-msg ai-msg-assistant">
                                <div className="ai-typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                    </div>
                    <form className="ai-assistant-input" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe your symptoms or ask health questions..."
                            disabled={loading}
                            maxLength={500}
                        />
                        <button type="submit" disabled={loading || !input.trim()}>
                            {loading ? "..." : "Send"}
                        </button>
                    </form>
                    <div className="ai-assistant-footer">
                        <small>
                            🔒 Your conversations are private • Always consult healthcare
                            professionals for medical advice
                        </small>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIHealthAssistant;
