const express = require("express");
const { getDoctorInfoController, updateDoctorInfoController, getDoctorByIdController, getAllDoctorController, getAllDoctorAppointmentsController, doctorApproveAppointmentController } = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

// ROUTER OBJECT
const router = express.Router();

// ROUTES
// GET DOCTOR INFORMATION || POST (for getting Auth token we have used post method)
router.post('/doctor-info', authMiddleware, getDoctorInfoController)

// UPDATE DOCTOR INFO || PUT
router.post('/update-doctor-info', authMiddleware, updateDoctorInfoController)

// GET ALL DOCTORS || GET
router.get('/get-all-doctors', authMiddleware, getAllDoctorController)

// GET SINGLE DOCTOR || POST
router.post('/getDoctorById', authMiddleware, getDoctorByIdController)

// ALL DOCTOR APPOINTMENTS || POST
router.post('/getAllDoctorAppointments', authMiddleware, getAllDoctorAppointmentsController)

// DOCTOR APPROVING APPOINTMENT || POST
router.post('/doctorApproveAppointment', authMiddleware, doctorApproveAppointmentController)

module.exports = router;