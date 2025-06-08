// backend/controller/appointmentController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Appointment } from "../models/appointmentSchema.js";
import { ErrorHandler } from "../middlewares/error.js";

// Create new appointment
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    doctorId,
    hasVisited,
    address,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !doctorId ||
    !address
  ) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  try {
    // Check if appointment date is valid
    const appointmentDate = new Date(appointment_date);
    if (appointmentDate < new Date()) {
      return next(new ErrorHandler("Appointment date cannot be in the past", 400));
    }

    // Check if appointment already exists for the same date and doctor
    const existingAppointment = await Appointment.findOne({
      appointment_date,
      doctorId,
      status: { $in: ["Pending", "Accepted"] }
    });

    if (existingAppointment) {
      return next(new ErrorHandler("An appointment already exists for this date and doctor", 400));
    }

    const appointment = await Appointment.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointment_date,
      department,
      doctor: {
        firstName: doctor_firstName,
        lastName: doctor_lastName,
      },
      doctorId,
      patientId: req.user._id, // Get patientId from authenticated user
      hasVisited: Boolean(hasVisited),
      address,
      status: "Pending"
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Appointment creation error:", error);
    return next(new ErrorHandler(error.message || "Failed to create appointment", 500));
  }
});

// Get all appointments
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate("patientId", "firstName lastName email")
    .sort("-appointment_date");

  res.status(200).json({
    success: true,
    data: appointments,
  });
});

// Get appointments for specific patient
export const getPatientAppointments = catchAsyncErrors(
  async (req, res, next) => {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    })
      .populate("patientId", "firstName lastName email")
      .sort("-appointment_date");

    res.status(200).json({
      success: true,
      data: appointments,
    });
  }
);

// Get single appointment
export const getAppointmentById = catchAsyncErrors(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id).populate(
    "patientId",
    "firstName lastName email"
  );

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// Update appointment status
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(new ErrorHandler("Appointment not found", 404));
    }

    appointment.status = req.body.status;
    appointment.hasVisited = req.body.hasVisited;
    appointment.updatedAt = Date.now();
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment,
    });
  }
);

// Delete appointment
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  // Use deleteOne() instead of deprecated remove()
  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});