const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, approveDoctorController, rejectDoctorController } = require('../controllers/adminCtrl')

// ROUTER
const router = express.Router();

// ROUTES
// ALL USERS || GET
router.get('/get-all-users', authMiddleware, getAllUsersController);

// ALL DOCTORS || GET
router.get('/get-all-doctors', authMiddleware, getAllDoctorsController);

// APPROVE DOCTORS || POST
router.post('/approve-doctors', authMiddleware, approveDoctorController)

// REJECT DOCTORS || POST
router.post('/reject-doctors', authMiddleware, rejectDoctorController);

module.exports = router;