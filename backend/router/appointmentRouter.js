// backend/router/appointmentRouter.js
import express from 'express';
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
  getAppointmentById,
  getPatientAppointments
} from '../controller/appointmentController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Patient routes (requires authentication)
router.post('/post', isAuthenticated, postAppointment); // Patient can create appointment
router.get('/patient/:patientId', isAuthenticated, getPatientAppointments); // Get appointments for specific patient

// Admin routes (requires authentication)
router.get('/getall', isAuthenticated, getAllAppointments); // Get all appointments
router.get('/:id', isAuthenticated, getAppointmentById); // Get single appointment
router.put('/update/:id', isAuthenticated, updateAppointmentStatus); // Update appointment status
router.delete('/delete/:id', isAuthenticated, deleteAppointment); // Delete appointment

export default router;
