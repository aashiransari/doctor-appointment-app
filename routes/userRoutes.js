const express = require('express');
const { LoginController, RegisterController, AuthController, ApplyDoctorController, getAllNotificationController, deleteAllNotificationConroller, bookAppointmentController, checkAvailabilityControlller, getAllUserAppointmentsController } = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

// ROUTER OBJECT
const router = express.Router();

//ROUTES
// LOGIN || POST
router.post('/login', LoginController)

// REGISTER || POST
router.post('/register', RegisterController)

// AUTH USER || POST
router.post('/getUserData', authMiddleware, AuthController)

// APPLY DOCTOR || POST
router.post('/apply-doctor', authMiddleware, ApplyDoctorController)

// NOTIFICATION || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController)

// DELETE NOTIFICATON || POST
router.post('/delete-all-notification', authMiddleware, deleteAllNotificationConroller)

// BOOK APPOINTMENT || POST
router.post('/bookAppointment', authMiddleware, bookAppointmentController)

// CHECK AVAILABILITY || POST
router.post('/checkAvailability', authMiddleware, checkAvailabilityControlller)

// GET ALL APPOINTMENTS || GET
router.post('/getAllUserAppointments', authMiddleware, getAllUserAppointmentsController)


module.exports = router;