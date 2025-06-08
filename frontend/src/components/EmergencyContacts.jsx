import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";

const contacts = [
    {
        label: "Hospital Emergency",
        number: "1800-123-456",
        icon: <LocalHospitalIcon color="error" />
    },
    {
        label: "Ambulance",
        number: "102",
        icon: <LocalPhoneIcon color="primary" />
    },
    {
        label: "Fire Brigade",
        number: "101",
        icon: <LocalFireDepartmentIcon color="warning" />
    },
    {
        label: "Police",
        number: "100",
        icon: <LocalPoliceIcon color="action" />
    }
];

const EmergencyContacts = () => (
    <section style={{ background: "#fff3e0", padding: "2rem 0" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ color: "#d32f2f", marginBottom: "1.5rem" }}>
                Emergency Contacts
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {contacts.map((contact) => (
                    <li
                        key={contact.label}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#fff",
                            marginBottom: "1rem",
                            padding: "1rem",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                        }}
                    >
                        <span style={{ fontSize: "2rem", marginRight: "1rem" }}>
                            {contact.icon}
                        </span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                                {contact.label}
                            </div>
                            <div style={{ color: "#d32f2f", fontSize: "1.2rem" }}>
                                {contact.number}
                            </div>
                        </div>
                        <a
                            href={`tel:${contact.number}`}
                            style={{
                                background: "#d32f2f",
                                color: "#fff",
                                padding: "0.5rem 1rem",
                                borderRadius: "4px",
                                textDecoration: "none",
                                fontWeight: "bold"
                            }}
                        >
                            Call
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

export default EmergencyContacts;