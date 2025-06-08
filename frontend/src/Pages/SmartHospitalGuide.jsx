import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const SmartHospitalGuide = () => {
    const [formData, setFormData] = useState({
        symptoms: '',
        healthIssue: '',
        urgencyLevel: 'moderate',
        additionalInfo: '',
        location: null,
        locationError: null
    });

    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Get user's current location
    const getCurrentLocation = () => {
        setLocationLoading(true);

        if (!navigator.geolocation) {
            setFormData(prev => ({
                ...prev,
                locationError: 'Geolocation is not supported by this browser.'
            }));
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    locationError: null
                }));
                setLocationLoading(false);
                toast.success('Location detected successfully!');
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                setFormData(prev => ({
                    ...prev,
                    locationError: errorMessage
                }));
                setLocationLoading(false);
                toast.error(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Get hospital recommendations from backend with Ollama AI
    const getHospitalRecommendations = async () => {
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/hospital-guide/recommendations",
                {
                    symptoms: formData.symptoms,
                    healthIssue: formData.healthIssue,
                    urgencyLevel: formData.urgencyLevel,
                    additionalInfo: formData.additionalInfo,
                    location: formData.location
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.success) {
                const { recommendations, aiAnalysis } = response.data.data;

                // Transform backend data to match frontend structure
                const transformedRecommendations = recommendations.map(hospital => ({
                    id: hospital.id,
                    name: hospital.name,
                    specialization: hospital.specialties.join(', '),
                    distance: `${hospital.distance} km`,
                    rating: hospital.rating,
                    address: hospital.address,
                    phone: hospital.phone,
                    emergencyServices: hospital.hasEmergency,
                    estimatedTime: hospital.estimatedTime,
                    coordinates: hospital.coordinates,
                    recommendationReason: hospital.recommendationReason,
                    matchScore: hospital.matchScore,
                    operatingHours: hospital.operatingHours,
                    matchingSpecialties: hospital.matchingSpecialties
                }));

                setRecommendations(transformedRecommendations);
                setShowResults(true);

                // Show AI analysis in toast
                if (aiAnalysis.needsEmergency) {
                    toast.warning(`AI Analysis: Severity ${aiAnalysis.severity}/10 - ${aiAnalysis.advice}`, {
                        autoClose: 8000
                    });
                } else {
                    toast.success('Hospital recommendations generated successfully!');
                }
            } else {
                toast.error(response.data.message || 'Failed to get recommendations');
            }
        } catch (error) {
            console.error('Recommendation error:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to get recommendations. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.symptoms.trim() && !formData.healthIssue.trim()) {
            toast.error('Please describe your symptoms or health issue.');
            return;
        }

        if (!formData.location) {
            toast.error('Please allow location access to find nearby hospitals.');
            return;
        }

        await getHospitalRecommendations();
    };

    // Generate Google Maps directions URL
    const getDirectionsUrl = (hospital) => {
        if (!formData.location) return '#';

        const origin = `${formData.location.lat},${formData.location.lng}`;
        const destination = `${hospital.coordinates.lat},${hospital.coordinates.lng}`;

        return `https://www.google.com/maps/dir/${origin}/${destination}`;
    };

    // Reset form and results
    const resetForm = () => {
        setFormData({
            symptoms: '',
            healthIssue: '',
            urgencyLevel: 'moderate',
            additionalInfo: '',
            location: null,
            locationError: null
        });
        setRecommendations([]);
        setShowResults(false);
    };

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '40px 20px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: 'bold' }}>
                    🏥 Smart Hospital Guide
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>
                    AI-powered hospital recommendations based on your symptoms and location
                </p>
            </div>

            {!showResults ? (
                /* Input Form */
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '15px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                    marginBottom: '30px'
                }}>
                    <form onSubmit={handleSubmit}>
                        {/* Symptoms Input */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                                color: '#333',
                                fontSize: '1.1rem'
                            }}>
                                🩺 Describe Your Symptoms *
                            </label>
                            <textarea
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleInputChange}
                                placeholder="e.g., chest pain, difficulty breathing, fever, headache..."
                                rows="4"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                        </div>

                        {/* Health Issue Input */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                                color: '#333',
                                fontSize: '1.1rem'
                            }}>
                                🏥 Specific Health Issue (Optional)
                            </label>
                            <input
                                type="text"
                                name="healthIssue"
                                value={formData.healthIssue}
                                onChange={handleInputChange}
                                placeholder="e.g., diabetes, heart condition, injury..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                        </div>

                        {/* Urgency Level */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                                color: '#333',
                                fontSize: '1.1rem'
                            }}>
                                ⚡ Urgency Level
                            </label>
                            <select
                                name="urgencyLevel"
                                value={formData.urgencyLevel}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="low">🟢 Low - Can wait for appointment</option>
                                <option value="moderate">🟡 Moderate - Need care soon</option>
                                <option value="high">🟠 High - Need immediate attention</option>
                                <option value="emergency">🔴 Emergency - Life threatening</option>
                            </select>
                        </div>

                        {/* Additional Information */}
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                                color: '#333',
                                fontSize: '1.1rem'
                            }}>
                                📝 Additional Information (Optional)
                            </label>
                            <textarea
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleInputChange}
                                placeholder="Any other relevant information about your condition..."
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                        </div>

                        {/* Location Section */}
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '25px',
                            border: '1px solid #e9ecef'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: '#333' }}>📍 Your Location</h3>

                            {!formData.location && !formData.locationError && (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ marginBottom: '15px', color: '#666' }}>
                                        We need your location to find nearby hospitals
                                    </p>
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        disabled={locationLoading}
                                        style={{
                                            background: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            cursor: locationLoading ? 'not-allowed' : 'pointer',
                                            opacity: locationLoading ? 0.7 : 1,
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {locationLoading ? '🔄 Detecting Location...' : '📍 Get My Location'}
                                    </button>
                                </div>
                            )}

                            {formData.location && (
                                <div style={{
                                    background: '#d4edda',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #c3e6cb'
                                }}>
                                    <p style={{ color: '#155724', margin: 0 }}>
                                        ✅ Location detected successfully!
                                    </p>
                                    <small style={{ color: '#6c757d' }}>
                                        Lat: {formData.location.lat.toFixed(4)}, Lng: {formData.location.lng.toFixed(4)}
                                    </small>
                                </div>
                            )}

                            {formData.locationError && (
                                <div style={{
                                    background: '#f8d7da',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #f5c6cb'
                                }}>
                                    <p style={{ color: '#721c24', margin: 0 }}>
                                        ❌ {formData.locationError}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        style={{
                                            background: 'transparent',
                                            color: '#721c24',
                                            border: '1px solid #721c24',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            marginTop: '10px'
                                        }}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !formData.location}
                            style={{
                                width: '100%',
                                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '15px',
                                borderRadius: '8px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                cursor: loading || !formData.location ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                opacity: loading || !formData.location ? 0.7 : 1
                            }}
                        >
                            {loading ? '🔄 Finding Best Hospitals...' : '🔍 Find Hospitals'}
                        </button>
                    </form>
                </div>
            ) : (
                /* Results Section */
                <div>
                    {/* Results Header */}
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '15px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                        marginBottom: '30px',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>
                            🎯 Recommended Hospitals
                        </h2>
                        <p style={{ color: '#666', marginBottom: '15px' }}>
                            Based on your symptoms and location
                        </p>
                        <button
                            onClick={resetForm}
                            style={{
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            🔄 New Search
                        </button>
                    </div>

                    {/* Hospital Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '20px'
                    }}>
                        {recommendations.map((hospital) => (
                            <div
                                key={hospital.id}
                                style={{
                                    background: 'white',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                                    border: '1px solid #e0e0e0',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                                }}
                            >
                                {/* Hospital Header */}
                                <div style={{ marginBottom: '15px' }}>
                                    <h3 style={{
                                        color: '#333',
                                        marginBottom: '5px',
                                        fontSize: '1.4rem'
                                    }}>
                                        {hospital.name}
                                    </h3>
                                    <p style={{
                                        color: '#667eea',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        marginBottom: '10px'
                                    }}>
                                        {hospital.specialization}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                                            📍 {hospital.distance}
                                        </span>
                                        <span style={{ color: '#ffc107', fontWeight: 'bold' }}>
                                            ⭐ {hospital.rating}
                                        </span>
                                        <span style={{ color: '#17a2b8', fontWeight: 'bold' }}>
                                            🕒 {hospital.estimatedTime}
                                        </span>
                                    </div>
                                </div>

                                {/* Hospital Details */}
                                <div style={{ marginBottom: '15px' }}>
                                    <p style={{ margin: '5px 0', color: '#555' }}>
                                        <strong>📍 Address:</strong> {hospital.address}
                                    </p>
                                    <p style={{ margin: '5px 0', color: '#555' }}>
                                        <strong>📞 Phone:</strong> {hospital.phone}
                                    </p>
                                    {hospital.emergencyServices && (
                                        <p style={{
                                            margin: '5px 0',
                                            color: '#dc3545',
                                            fontWeight: 'bold'
                                        }}>
                                            🚨 24/7 Emergency Services Available
                                        </p>
                                    )}
                                </div>

                                {/* AI Recommendation */}
                                <div style={{
                                    background: '#e8f4fd',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    marginBottom: '15px',
                                    border: '1px solid #bee5eb'
                                }}>
                                    <p style={{
                                        margin: 0,
                                        color: '#0c5460',
                                        fontSize: '0.95rem',
                                        fontStyle: 'italic'
                                    }}>
                                        🤖 <strong>AI Recommendation:</strong> {hospital.recommendationReason}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    flexWrap: 'wrap'
                                }}>
                                    <a
                                        href={getDirectionsUrl(hospital)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            flex: '1',
                                            background: '#28a745',
                                            color: 'white',
                                            textDecoration: 'none',
                                            padding: '10px 15px',
                                            borderRadius: '6px',
                                            textAlign: 'center',
                                            fontSize: '0.95rem',
                                            fontWeight: 'bold',
                                            transition: 'background 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#218838'}
                                        onMouseLeave={(e) => e.target.style.background = '#28a745'}
                                    >
                                        🗺️ Get Directions
                                    </a>
                                    <a
                                        href={`tel:${hospital.phone}`}
                                        style={{
                                            flex: '1',
                                            background: '#007bff',
                                            color: 'white',
                                            textDecoration: 'none',
                                            padding: '10px 15px',
                                            borderRadius: '6px',
                                            textAlign: 'center',
                                            fontSize: '0.95rem',
                                            fontWeight: 'bold',
                                            transition: 'background 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#0056b3'}
                                        onMouseLeave={(e) => e.target.style.background = '#007bff'}
                                    >
                                        📞 Call Now
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Emergency Notice */}
            <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '10px',
                padding: '20px',
                marginTop: '30px',
                textAlign: 'center'
            }}>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>
                    🚨 Emergency Notice
                </h4>
                <p style={{ color: '#856404', margin: 0 }}>
                    If you are experiencing a life-threatening emergency, please call <strong>911</strong> immediately
                    or go to the nearest emergency room. Do not rely solely on this tool for emergency situations.
                </p>
            </div>
        </div>
    );
};

export default SmartHospitalGuide;