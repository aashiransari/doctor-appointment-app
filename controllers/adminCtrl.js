const doctorModel = require('../models/doctorModel');
const userModel = require('../models/userModels');

// Getting all users controller
const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({})
        users.password = undefined;
        res.status(200).send({
            success: true,
            message: "All Users Fetched Success",
            data: users
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Fetching Users",
            error
        })
    }
}

// Getting all doctors controller
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({
            success: true,
            message: "All Doctors Fetched Success",
            data: doctors
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching Doctors",
            error
        })
    }
}

// Approve doctor controller
const approveDoctorController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
        const user = await userModel.findById({ _id: doctor.userId });
        const notification = user.notification;
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your doctor account has been ${status}`,
            onClickPath: '/notification'
        })
        if (doctor) {
            user.isDoctor = true
            await user.save();
        }
        res.status(200).send({
            success: true,
            message: "Doctor approved successfully",
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error occured while approving.."
        })
    }
}

// Reject doctor controller
const rejectDoctorController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
        const user = await userModel.findById({ _id: doctor.userId });
        const notification = user.notification;
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your doctor account has been ${status}`,
            onClickPath: '/notification'
        })
        if (doctor) {
            user.isDoctor = false
            await user.save();
        }
        res.status(200).send({
            success: true,
            message: "Doctor Rejected successfully",
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error occured while rejecting",
            error
        })
    }
}

module.exports = { getAllUsersController, getAllDoctorsController, approveDoctorController, rejectDoctorController };