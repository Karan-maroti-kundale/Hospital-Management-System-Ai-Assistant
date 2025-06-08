import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Hospital name is required"],
        trim: true,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
        fullAddress: {
            type: String,
            required: true,
        },
    },
    coordinates: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    contact: {
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email",
            },
        },
        website: String,
        emergencyPhone: String,
    },
    services: {
        specialties: [
            {
                type: String,
                enum: [
                    "General Medicine",
                    "Emergency Medicine",
                    "Cardiology",
                    "Neurology",
                    "Orthopedics",
                    "Pediatrics",
                    "Oncology",
                    "Radiology",
                    "Dermatology",
                    "ENT",
                    "Physical Therapy",
                    "Internal Medicine",
                    "Surgery",
                    "Psychiatry",
                    "Gynecology",
                    "Urology",
                    "Ophthalmology",
                    "Trauma Care",
                    "Critical Care",
                    "Anesthesiology",
                ],
            },
        ],
        hasEmergency: {
            type: Boolean,
            default: false,
        },
        hasICU: {
            type: Boolean,
            default: false,
        },
        hasTraumaCenter: {
            type: Boolean,
            default: false,
        },
        has24x7: {
            type: Boolean,
            default: false,
        },
        ambulanceService: {
            type: Boolean,
            default: false,
        },
    },
    operatingHours: {
        monday: { start: String, end: String },
        tuesday: { start: String, end: String },
        wednesday: { start: String, end: String },
        thursday: { start: String, end: String },
        friday: { start: String, end: String },
        saturday: { start: String, end: String },
        sunday: { start: String, end: String },
        is24x7: {
            type: Boolean,
            default: false,
        },
    },
    ratings: {
        overall: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        cleanliness: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        staff: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        facilities: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
    },
    capacity: {
        totalBeds: Number,
        availableBeds: Number,
        icuBeds: Number,
        emergencyBeds: Number,
    },
    insurance: [
        {
            type: String, // Insurance providers accepted
        },
    ],
    facilities: [
        {
            type: String,
            enum: [
                "Parking",
                "Pharmacy",
                "Laboratory",
                "X-Ray",
                "MRI",
                "CT Scan",
                "Ultrasound",
                "Blood Bank",
                "Dialysis",
                "Physiotherapy",
                "Cafeteria",
                "ATM",
                "Wheelchair Access",
                "WiFi",
            ],
        },
    ],
    accreditation: [
        {
            organization: String,
            certification: String,
            validUntil: Date,
        },
    ],
    doctors: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User", // Reference to doctor users
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for geospatial queries
hospitalSchema.index({ coordinates: "2dsphere" });

// Index for text search
hospitalSchema.index({
    name: "text",
    "address.fullAddress": "text",
    "services.specialties": "text",
});

// Update the updatedAt field before saving
hospitalSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Static method to find nearby hospitals
hospitalSchema.statics.findNearby = function (lat, lng, maxDistance = 50000) {
    return this.find({
        coordinates: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
                $maxDistance: maxDistance, // in meters
            },
        },
        isActive: true,
    });
};

// Static method to find by specialty
hospitalSchema.statics.findBySpecialty = function (specialty) {
    return this.find({
        "services.specialties": { $in: [specialty] },
        isActive: true,
    });
};

// Instance method to check if hospital is open
hospitalSchema.methods.isOpen = function (date = new Date()) {
    if (this.operatingHours.is24x7 || this.services.has24x7) {
        return true;
    }

    const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    const currentDay = dayNames[date.getDay()];
    const currentTime = date.getHours() * 100 + date.getMinutes(); // HHMM format

    const daySchedule = this.operatingHours[currentDay];
    if (!daySchedule || !daySchedule.start || !daySchedule.end) {
        return false;
    }

    const startTime = parseInt(daySchedule.start.replace(":", ""));
    const endTime = parseInt(daySchedule.end.replace(":", ""));

    return currentTime >= startTime && currentTime <= endTime;
};

export const Hospital = mongoose.model("Hospital", hospitalSchema);
