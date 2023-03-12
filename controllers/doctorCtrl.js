const doctorModel = require('../models/doctorModel');
const appointmentModel = require("../models/appointmentModel")

const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: "Doctor Info Fetched Successfully",
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While getting info",
            error
        })
    }
}

const updateDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
        res.status(201).send({
            success: true,
            message: "Your Details Updated",
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updated details",
            error
        })
    }
}

// Ge all doctors
const getAllDoctorController = async (req, res) => {
    try {
        const doctor = await doctorModel.find({ status: "approved" });
        if (!doctor) {
            res.status(500).send({
                success: false,
                message: "No doctor found",
            })
        } else {
            res.status(200).send({
                success: true,
                message: "All Doctors Fetch Success",
                data: doctor
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error occured while fetchinf doctor",
            error
        })
    }
}

// Get single doctor by id
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findById({ _id: req.body.doctorId });
        res.status(200).send({
            success: true,
            message: "Single Doctor Fetched Success",
            data: doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error occured"
        })
    }
}

const getAllDoctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const doctorAppointments = await appointmentModel.find({ doctorId: doctor._id })
        if (!doctorAppointments) {
            return res.status(500).send({
                success: false,
                message: "No Appointments Found"
            })
        } else {
            res.status(200).send({
                success: true,
                message: "Doctor appointments fetched success",
                data: doctorAppointments
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching doctor appointments",
            error
        })
    }
}

const doctorApproveAppointmentController = async (req, res) => {
    try {
        const appointment = await appointmentModel.findOne({ _id: req.body.appointmentId });
        if (!appointment) {
            return res.status(500).send({
                success: false,
                message: "No such appointment Found"
            })
        } else {
            appointment.status = "approved";
            await appointment.save()
            res.status(200).send({
                success: true,
                message: "Approved Success",
                data: appointment
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while approving appoinement",
            error
        })
    }
}

module.exports = {
    getDoctorInfoController,
    updateDoctorInfoController,
    getAllDoctorController,
    getDoctorByIdController,
    getAllDoctorAppointmentsController,
    doctorApproveAppointmentController
}