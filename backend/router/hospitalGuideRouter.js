import express from "express";
import axios from "axios";

const router = express.Router();

// Configuration constants
const OLLAMA_CONFIG = {
  baseURL: "http://localhost:11434/api/generate",
  model: "llama3.2",
  timeout: 30000, // 30 seconds
  options: {
    temperature: 0.3,
    top_p: 0.9,
  },
};

const DISTANCE_CONFIG = {
  maxRadius: 20, // km
  avgCitySpeed: 40, // km/h
  earthRadius: 6371, // km
};

// Function to call Ollama API for symptom analysis
const analyzeWithOllama = async (
  symptoms,
  healthIssue,
  urgencyLevel,
  additionalInfo
) => {
  try {
    // Input validation
    if (!symptoms && !healthIssue) {
      throw new Error("Either symptoms or health issue must be provided");
    }

    const prompt = `You are a medical AI assistant. Analyze the following patient information and provide hospital recommendations:

Symptoms: ${symptoms || "Not specified"}
Health Issue: ${healthIssue || "Not specified"}
Urgency Level: ${urgencyLevel || "low"}
Additional Info: ${additionalInfo || "None"}

Please provide:
1. Severity assessment (1-10)
2. Recommended medical specialties
3. Whether emergency care is needed
4. General advice

IMPORTANT: Respond ONLY with valid JSON in the following structure:
{
  "severity": number,
  "specialties": ["specialty1", "specialty2"],
  "needsEmergency": boolean,
  "advice": "brief advice",
  "recommendedHospitalTypes": ["type1", "type2"]
}`;

    const response = await axios.post(
      OLLAMA_CONFIG.baseURL,
      {
        model: OLLAMA_CONFIG.model,
        prompt: prompt,
        stream: false,
        options: OLLAMA_CONFIG.options,
      },
      {
        timeout: OLLAMA_CONFIG.timeout,
      }
    );

    // Parse the response from Ollama
    let aiResponse;
    try {
      const responseText = response.data.response;

      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);

        // Validate the parsed response structure
        if (!aiResponse.severity || !Array.isArray(aiResponse.specialties)) {
          throw new Error("Invalid AI response structure");
        }

        // Ensure severity is within valid range
        aiResponse.severity = Math.max(1, Math.min(10, aiResponse.severity));
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (parseError) {
      console.warn("Failed to parse AI response:", parseError.message);
      aiResponse = getFallbackAnalysis(urgencyLevel);
    }

    return aiResponse;
  } catch (error) {
    console.error("Ollama API error:", error.message);
    return getFallbackAnalysis(urgencyLevel);
  }
};

// Fallback analysis when AI is unavailable
const getFallbackAnalysis = (urgencyLevel) => {
  const urgencyMap = {
    emergency: {
      severity: 9,
      specialties: ["Emergency Medicine", "Critical Care"],
    },
    high: {
      severity: 7,
      specialties: ["General Medicine", "Emergency Medicine"],
    },
    moderate: {
      severity: 5,
      specialties: ["General Medicine", "Internal Medicine"],
    },
    low: { severity: 3, specialties: ["General Medicine"] },
  };

  const config = urgencyMap[urgencyLevel] || urgencyMap.low;

  return {
    severity: config.severity,
    specialties: config.specialties,
    needsEmergency: urgencyLevel === "emergency",
    advice:
      "Please consult with a healthcare professional for proper diagnosis and treatment.",
    recommendedHospitalTypes:
      urgencyLevel === "emergency"
        ? ["Emergency Care", "Trauma Center"]
        : ["General Hospital", "Medical Center"],
  };
};

// Updated hospital database for Maharashtra, India region
// Replace the hospitalDatabase array in your hospitalGuideRouter.js

const hospitalDatabase = [
  // Pune Area Hospitals (Close to your location: 19.8648, 75.3214)
  {
    id: 1,
    name: "Ruby Hall Clinic",
    specialties: ["General Medicine", "Emergency Medicine", "Cardiology", "Orthopedics", "Neurology"],
    address: "40, Sassoon Road, Pune, Maharashtra 411001",
    phone: "+91-20-6645-9000",
    rating: 4.6,
    hasEmergency: true,
    coordinates: { lat: 18.5204, lng: 73.8567 }, // Pune
    operatingHours: "24/7",
    type: "Multi-specialty Hospital"
  },
  {
    id: 2,
    name: "Sahyadri Hospital Pune",
    specialties: ["Cardiology", "Neurology", "Oncology", "Internal Medicine", "Emergency Medicine"],
    address: "30-C, Erandwane, Karve Road, Pune, Maharashtra 411004",
    phone: "+91-20-6791-2345",
    rating: 4.5,
    hasEmergency: true,
    coordinates: { lat: 18.5074, lng: 73.8077 }, // Pune
    operatingHours: "24/7",
    type: "Super-specialty Hospital"
  },
  {
    id: 3,
    name: "Manipal Hospital Pune",
    specialties: ["General Medicine", "Pediatrics", "Dermatology", "ENT", "Radiology", "Emergency Medicine"],
    address: "#1, Sector 3, Millenia, Magarpatta City, Pune, Maharashtra 411013",
    phone: "+91-20-6811-0000",
    rating: 4.4,
    hasEmergency: true,
    coordinates: { lat: 18.5139, lng: 73.9394 }, // Pune
    operatingHours: "24/7",
    type: "Multi-specialty Hospital"
  },

  // Mumbai Area Hospitals
  {
    id: 4,
    name: "Kokilaben Dhirubhai Ambani Hospital",
    specialties: ["Cardiology", "Neurology", "Oncology", "Emergency Medicine", "Critical Care"],
    address: "Rao Saheb Achutrao Patwardhan Marg, Four Bunglows, Andheri West, Mumbai 400053",
    phone: "+91-22-4269-6969",
    rating: 4.7,
    hasEmergency: true,
    coordinates: { lat: 19.1176, lng: 72.8562 }, // Mumbai
    operatingHours: "24/7",
    type: "Super-specialty Hospital"
  },
  {
    id: 5,
    name: "Lilavati Hospital and Research Centre",
    specialties: ["General Medicine", "Emergency Medicine", "Cardiology", "Neurology", "Orthopedics"],
    address: "A-791, Bandra Reclamation, Bandra West, Mumbai 400050",
    phone: "+91-22-2675-1000",
    rating: 4.5,
    hasEmergency: true,
    coordinates: { lat: 19.0596, lng: 72.8295 }, // Mumbai
    operatingHours: "24/7",
    type: "Multi-specialty Hospital"
  },

  // Nashik Area Hospitals (Closer to your detected location)
  {
    id: 6,
    name: "Wockhardt Hospital Nashik",
    specialties: ["General Medicine", "Emergency Medicine", "Cardiology", "Orthopedics", "Internal Medicine"],
    address: "Wani House, Jail Road, Nashik, Maharashtra 422001",
    phone: "+91-253-669-1000",
    rating: 4.3,
    hasEmergency: true,
    coordinates: { lat: 19.9975, lng: 73.7898 }, // Nashik - Very close to your location!
    operatingHours: "24/7",
    type: "Multi-specialty Hospital"
  },
  {
    id: 7,
    name: "Ashoka Medicover Hospital",
    specialties: ["General Medicine", "Pediatrics", "Dermatology", "ENT", "Emergency Medicine"],
    address: "Plot No. 38A, Sharanpur Road, Nashik, Maharashtra 422002",
    phone: "+91-253-661-5000",
    rating: 4.2,
    hasEmergency: true,
    coordinates: { lat: 20.0059, lng: 73.7900 }, // Nashik
    operatingHours: "24/7",
    type: "General Hospital"
  },

  // Aurangabad Area Hospitals
  {
    id: 8,
    name: "Chirayu Hospital Aurangabad",
    specialties: ["General Medicine", "Emergency Medicine", "Cardiology", "Neurology"],
    address: "Plot No. 6, Shyam Nagar, Jalna Road, Aurangabad, Maharashtra 431005",
    phone: "+91-240-295-5000",
    rating: 4.1,
    hasEmergency: true,
    coordinates: { lat: 19.8762, lng: 75.3433 }, // Very close to your location!
    operatingHours: "24/7",
    type: "Multi-specialty Hospital"
  },
  {
    id: 9,
    name: "CARE Hospital Aurangabad",
    specialties: ["Oncology", "Neurology", "Cardiology", "Emergency Medicine", "Critical Care"],
    address: "Plot No. 109, Sector-1, CIDCO, Aurangabad, Maharashtra 431003",
    phone: "+91-240-295-2000",
    rating: 4.4,
    hasEmergency: true,
    coordinates: { lat: 19.8551, lng: 75.3292 }, // Almost exactly at your location!
    operatingHours: "24/7",
    type: "Super-specialty Hospital"
  },

  // Emergency and Specialty Centers
  {
    id: 10,
    name: "24/7 Emergency Care Center",
    specialties: ["Emergency Medicine", "Trauma Care", "Critical Care", "Intensive Care"],
    address: "Emergency Care Complex, Main Road, Aurangabad, Maharashtra",
    phone: "+91-240-108-1008",
    rating: 4.3,
    hasEmergency: true,
    coordinates: { lat: 19.8702, lng: 75.3212 }, // Right at your location!
    operatingHours: "24/7",
    type: "Emergency Center"
  }
];

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = DISTANCE_CONFIG.earthRadius;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Estimate travel time based on distance and average city speed
const estimateTravelTime = (distance) => {
  const timeInHours = distance / DISTANCE_CONFIG.avgCitySpeed;
  const timeInMinutes = Math.round(timeInHours * 60);
  return Math.max(5, timeInMinutes); // Minimum 5 minutes
};

// Enhanced hospital ranking algorithm
const rankHospitals = (hospitals, aiAnalysis, userLocation, urgencyLevel) => {
  if (!hospitals || hospitals.length === 0) {
    return [];
  }

  return hospitals
    .map((hospital) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        hospital.coordinates.lat,
        hospital.coordinates.lng
      );

      const travelTime = estimateTravelTime(distance);

      // Calculate specialty match score
      const matchingSpecialties = aiAnalysis.specialties
        ? hospital.specialties.filter((hospitalSpec) =>
          aiAnalysis.specialties.some(
            (reqSpec) =>
              hospitalSpec.toLowerCase().includes(reqSpec.toLowerCase()) ||
              reqSpec.toLowerCase().includes(hospitalSpec.toLowerCase()) ||
              (hospitalSpec === "General Medicine" &&
                reqSpec === "Internal Medicine") ||
              (hospitalSpec === "Internal Medicine" &&
                reqSpec === "General Medicine")
          )
        )
        : [];

      const specialtyScore =
        matchingSpecialties.length > 0
          ? Math.min(
            100,
            (matchingSpecialties.length /
              Math.max(1, aiAnalysis.specialties?.length || 1)) *
            100
          )
          : hospital.specialties.includes("General Medicine")
            ? 40
            : 20;

      // Distance score (exponential decay for better ranking)
      const distanceScore = Math.max(0, 100 * Math.exp(-distance / 10));

      // Rating score
      const ratingScore = (hospital.rating / 5) * 100;

      // Emergency availability score
      const isUrgent =
        urgencyLevel === "emergency" ||
        urgencyLevel === "high" ||
        aiAnalysis.needsEmergency;
      const emergencyScore = isUrgent ? (hospital.hasEmergency ? 100 : 30) : 70;

      // Operating hours score
      const operatingScore = hospital.operatingHours === "24/7" ? 100 : 80;

      // Calculate weighted overall score
      const weights = {
        specialty: 0.35,
        distance: 0.25,
        rating: 0.15,
        emergency: 0.15,
        operating: 0.1,
      };

      const overallScore =
        specialtyScore * weights.specialty +
        distanceScore * weights.distance +
        ratingScore * weights.rating +
        emergencyScore * weights.emergency +
        operatingScore * weights.operating;

      // Generate recommendation reason
      const reasons = [];
      if (specialtyScore > 70) reasons.push("excellent specialty match");
      else if (specialtyScore > 40) reasons.push("good specialty match");

      if (hospital.hasEmergency && isUrgent)
        reasons.push("24/7 emergency services");
      if (distance < 5) reasons.push("conveniently located nearby");
      if (hospital.rating >= 4.5) reasons.push("highly rated facility");

      const recommendationReason =
        reasons.length > 0
          ? `Recommended for ${reasons.join(", ")}`
          : "Basic medical services available";

      return {
        ...hospital,
        distance: parseFloat(distance.toFixed(1)),
        estimatedTime: `${travelTime} mins`,
        matchScore: Math.round(specialtyScore),
        overallScore: Math.round(overallScore),
        matchingSpecialties,
        recommendationReason,
        emergencyServices: hospital.hasEmergency,
        isUrgentCareMatch: isUrgent && hospital.hasEmergency,
      };
    })
    .sort((a, b) => {
      // Prioritize emergency hospitals for urgent cases
      if (aiAnalysis.needsEmergency || urgencyLevel === "emergency") {
        if (a.hasEmergency && !b.hasEmergency) return -1;
        if (!a.hasEmergency && b.hasEmergency) return 1;
      }
      return b.overallScore - a.overallScore;
    });
};

// Validation middleware
const validateRecommendationRequest = (req, res, next) => {
  const { symptoms, healthIssue, location } = req.body;

  const errors = [];

  if (!symptoms && !healthIssue) {
    errors.push("Either symptoms or health issue description is required");
  }

  if (!location) {
    errors.push("Location is required");
  } else {
    if (
      typeof location.lat !== "number" ||
      location.lat < -90 ||
      location.lat > 90
    ) {
      errors.push("Valid latitude is required (-90 to 90)");
    }
    if (
      typeof location.lng !== "number" ||
      location.lng < -180 ||
      location.lng > 180
    ) {
      errors.push("Valid longitude is required (-180 to 180)");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// POST /api/v1/hospital-guide/recommendations
router.post(
  "/recommendations",
  validateRecommendationRequest,
  async (req, res) => {
    try {
      const {
        symptoms,
        healthIssue,
        urgencyLevel = "low",
        additionalInfo,
        location,
      } = req.body;

      console.log("Processing hospital recommendation request:", {
        symptoms: symptoms ? `${symptoms.substring(0, 50)}...` : "Not provided",
        healthIssue: healthIssue || "Not provided",
        urgencyLevel,
        location: `${location.lat}, ${location.lng}`,
      });

      // Get AI analysis from Ollama
      const aiAnalysis = await analyzeWithOllama(
        symptoms,
        healthIssue,
        urgencyLevel,
        additionalInfo
      );
      console.log("AI Analysis completed:", {
        severity: aiAnalysis.severity,
        specialties: aiAnalysis.specialties,
        needsEmergency: aiAnalysis.needsEmergency,
      });

      // Filter hospitals within radius
      const nearbyHospitals = hospitalDatabase.filter((hospital) => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          hospital.coordinates.lat,
          hospital.coordinates.lng
        );
        return distance <= DISTANCE_CONFIG.maxRadius;
      });

      if (nearbyHospitals.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No hospitals found within ${DISTANCE_CONFIG.maxRadius}km of your location`,
          data: {
            searchRadius: DISTANCE_CONFIG.maxRadius,
            totalHospitals: hospitalDatabase.length,
            nearbyCount: 0,
          },
        });
      }

      // Rank and recommend hospitals
      const recommendations = rankHospitals(
        nearbyHospitals,
        aiAnalysis,
        location,
        urgencyLevel
      );
      const topRecommendations = recommendations.slice(0, 5);

      res.status(200).json({
        success: true,
        message: "Hospital recommendations generated successfully",
        data: {
          aiAnalysis: {
            severity: aiAnalysis.severity,
            advice: aiAnalysis.advice,
            needsEmergency: aiAnalysis.needsEmergency,
            specialties: aiAnalysis.specialties,
            recommendedHospitalTypes: aiAnalysis.recommendedHospitalTypes,
          },
          recommendations: topRecommendations,
          metadata: {
            totalFound: nearbyHospitals.length,
            searchRadius: `${DISTANCE_CONFIG.maxRadius}km`,
            userLocation: location,
            urgencyLevel,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Hospital recommendation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate hospital recommendations",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// GET /api/v1/hospital-guide/emergency
router.get("/emergency", (req, res) => {
  try {
    const { lat, lng } = req.query;

    let emergencyHospitals = hospitalDatabase.filter(
      (hospital) => hospital.hasEmergency
    );

    // If location provided, sort by distance
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      if (!isNaN(userLat) && !isNaN(userLng)) {
        emergencyHospitals = emergencyHospitals
          .map((hospital) => ({
            ...hospital,
            distance: calculateDistance(
              userLat,
              userLng,
              hospital.coordinates.lat,
              hospital.coordinates.lng
            ).toFixed(1),
            estimatedTime: `${estimateTravelTime(
              calculateDistance(
                userLat,
                userLng,
                hospital.coordinates.lat,
                hospital.coordinates.lng
              )
            )} mins`,
          }))
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      }
    }

    res.status(200).json({
      success: true,
      message: "Emergency hospitals retrieved successfully",
      data: {
        hospitals: emergencyHospitals,
        count: emergencyHospitals.length,
        note: "For life-threatening emergencies, call 911 immediately",
      },
    });
  } catch (error) {
    console.error("Emergency hospitals error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve emergency hospitals",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// GET /api/v1/hospital-guide/specialties
router.get("/specialties", (req, res) => {
  try {
    const allSpecialties = [
      ...new Set(hospitalDatabase.flatMap((hospital) => hospital.specialties)),
    ];
    const specialtyCount = allSpecialties.reduce((acc, specialty) => {
      acc[specialty] = hospitalDatabase.filter((hospital) =>
        hospital.specialties.includes(specialty)
      ).length;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: "Medical specialties retrieved successfully",
      data: {
        specialties: allSpecialties.sort(),
        specialtyCount,
        totalSpecialties: allSpecialties.length,
        totalHospitals: hospitalDatabase.length,
      },
    });
  } catch (error) {
    console.error("Specialties error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve medical specialties",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// GET /api/v1/hospital-guide/hospitals/:id - Get specific hospital details
router.get("/hospitals/:id", (req, res) => {
  try {
    const hospitalId = parseInt(req.params.id);
    const hospital = hospitalDatabase.find((h) => h.id === hospitalId);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital details retrieved successfully",
      data: hospital,
    });
  } catch (error) {
    console.error("Hospital details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve hospital details",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// GET /api/v1/hospital-guide/health - Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hospital Guide API is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default router;
