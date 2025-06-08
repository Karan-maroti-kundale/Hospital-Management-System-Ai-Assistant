import { useState } from "react";
import PropTypes from "prop-types";

const hospitals = [
    {
        name: "Care Hospitals",
        address: "Plot No. 140, N-3, CIDCO, Jalna Road, Chhatrapati Sambhaji Nagar",
        phone: "+91 240 662 5555",
        specialties: ["Cardiology", "Neurology", "Orthopedics"],
        img: "/hospital1.jpg",
        url: "https://www.carehospitals.com/aurangabad/"
    },
    {
        name: "Medicover Hospitals",
        address: "Plot No. P-64, MIDC, Chikalthana, Chhatrapati Sambhaji Nagar",
        phone: "+91 240 660 6666",
        specialties: ["Emergency", "Oncology", "Pediatrics"],
        img: "/hospital2.jpg",
        url: "https://www.medicoverhospitals.in/locations/maharashtra/aurangabad/"
    },
    {
        name: "MGM Medical College & Hospital",
        address: "N-6, CIDCO, Chhatrapati Sambhaji Nagar",
        phone: "+91 240 248 1090",
        specialties: ["General Medicine", "Surgery", "Gynecology"],
        img: "/hospital3.jpg",
        url: "https://www.mgmmedicalcollege.org/"
    },
    {
        name: "Kamalnayan Bajaj Hospital",
        address: "Gut No. 43, Satara Parisar, Beed Bypass, Chhatrapati Sambhaji Nagar",
        phone: "+91 240 663 7000",
        specialties: ["ENT", "Dermatology", "Nephrology"],
        img: "/hospital4.jpg",
        url: "https://www.kamalnayanbajajhospital.org/"
    },
    {
        name: "Manikchand Hospital",
        address: "Jalna Road, Chhatrapati Sambhaji Nagar",
        phone: "+91 240 236 1234",
        specialties: ["Dental", "Urology", "Radiology"],
        img: "/hospital5.jpg",
        url: "https://www.manikchandhospital.com/"
    }
];

const HospitalSearchBar = ({ onResult }) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchQuery = query.trim().toLowerCase();
        if (searchQuery) {
            const results = hospitals.filter(hospital =>
                hospital.name.toLowerCase().includes(searchQuery) ||
                hospital.address.toLowerCase().includes(searchQuery) ||
                hospital.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery))
            );
            setSearchResults(results);
            if (onResult) onResult(results);
        } else {
            setSearchResults(null);
            if (onResult) onResult(null);
        }
    };

    return (
        <section className="hospital-search-section">
            <div className="hospital-search-bar-centered">
                <form onSubmit={handleSearch} className="hospital-search-form-pro">
                    <input
                        type="text"
                        placeholder="Search hospital name, location or specialty..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="hospital-search-input-pro"
                    />
                    <button type="submit" className="hospital-search-btn-pro">Search</button>
                </form>
            </div>
            {searchResults && (
                <div className="hospital-search-results-pro">
                    {searchResults.length > 0 ? (
                        <div className="hospital-search-grid-pro">
                            {searchResults.map((hospital, index) => (
                                <div key={index} className="hospital-search-card-pro">
                                    <img src={hospital.img} alt={hospital.name} className="hospital-search-img-pro" />
                                    <div className="hospital-search-info-pro">
                                        <h3 className="hospital-search-title-pro">{hospital.name}</h3>
                                        <p className="hospital-search-address-pro">{hospital.address}</p>
                                        <p className="hospital-search-phone-pro">📞 {hospital.phone}</p>
                                        <div className="hospital-search-specialties-pro">
                                            <b>Specialties:</b> {hospital.specialties.join(", ")}
                                        </div>
                                        <a href={hospital.url} target="_blank" rel="noopener noreferrer" className="hospital-search-link-pro">Visit Website</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            No hospitals found matching your search. Try searching by:
                            <ul>
                                <li>Hospital name (e.g., "Care", "Medicover")</li>
                                <li>Location (e.g., "CIDCO", "Chikalthana")</li>
                                <li>Specialty (e.g., "Cardiology", "Pediatrics")</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

HospitalSearchBar.propTypes = {
    onResult: PropTypes.func
};

export default HospitalSearchBar;