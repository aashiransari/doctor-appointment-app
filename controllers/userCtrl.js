const userModel = require('../models/userModels');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const RegisterController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        console.log(existingUser);
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'User Already Exists'
            })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully'
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Registration Controller: ${error.message}`
        })
    }
}

const LoginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({
                message: "User Not Found",
                success: false
            })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({
                message: "Invalid Credentials",
                success: false
            })
        }
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).send({
            message: "Login Successful",
            success: true,
            token,
        })
    } catch (error) {
        res.status(500).send({
            message: `Login Ctrl Failed ${error.message}`
        })
    }
}

const AuthController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            res.status(200).send({
                message: "user not found",
                success: false
            })
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Auth Error",
            success: false,
            error
        })
    }
}

const ApplyDoctorController = async (req, res) => {
    try {
        const existingDoctor = await doctorModel.findOne({
            email: req.body.email,
        });
        if (existingDoctor) {
            return res.status(200).send({
                success: false,
                message: "This email is already registered with us"
            })
        }
        const newDoctor = new doctorModel(req.body);
        await newDoctor.save();
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification;
        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: "/admin/doctors"
            }
        })
        await userModel.findOneAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message: "You have been successfully appiled for doctor"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error Occured While applying for doctor"
        })
    }
}

//Read all notification
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        const seenNotification = user.seenNotification;
        const notification = user.notification;
        seenNotification.push(...notification);
        user.notification = [];
        user.seenNotification = notification;
        const updatedUser = await user.save();
        res.status(201).send({
            success: true,
            message: "All Notifications are marked as Read",
            data: updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Displaying Notifications",
            error
        })
    }
}

// Delete all notification
const deleteAllNotificationConroller = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        user.notification = [];
        user.seenNotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Notifications Cleared Successfully",
            data: updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Deleting",
            error
        })
    }
}

const checkAvailabilityControlller = async (req, res) => {
    try {
        const appointment = await appointmentModel.find({ doctorId: req.body.doctorId, date: req.body.date })
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        const dailyAppointment = doctor.dailyappointment;

        if (dailyAppointment == appointment.length) {
            return res.status(200).send({
                success: false,
                message: "Appointment not available for today"
            })
        } else {
            res.status(201).send({
                success: true,
                message: "Appointment is availablee"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error occured in checking availability"
        })
    }
}

const bookAppointmentController = async (req, res) => {
    try {
        const appointmentExists = await appointmentModel.find({ doctorId: req.body.doctorId, date: req.body.date })
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        if (appointmentExists.length == doctor.dailyappointment) {
            return res.status(200).send({
                success: false,
                message: "Appointment not available for Today"
            })
        }
        const appointment = new appointmentModel(req.body);
        await appointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.notification.push({
            type: 'new-appointment-request',
            message: `A new appointment request from ${req.body.userInfo.name}`,
            onClickPath: '/user/appointments'
        })
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Appointment Book Success'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Booking",
            error
        })
    }
}

const getAllUserAppointmentsController = async (req, res) => {
    try {
        const userAppointment = await appointmentModel.find({ userId: req.body.userId });
        if (!userAppointment) {
            return res.status(500).send({
                success: false,
                message: "You dont have any appointments yet"
            })
        } else {
            res.status(200).send({
                success: true,
                message: "Appoinments fetched success",
                data: userAppointment
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching user appointments"
        })
    }
}

module.exports = {
    LoginController,
    RegisterController,
    AuthController,
    ApplyDoctorController,
    getAllNotificationController,
    deleteAllNotificationConroller,
    bookAppointmentController,
    checkAvailabilityControlller,
    getAllUserAppointmentsController
}