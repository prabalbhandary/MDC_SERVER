const express = require("express");
const Doctor = require("../model/doctorModel");
const Appointment = require("../model/appointmentModel")
const { authMiddleware } = require("../middlewares/authMiddleware");
const User = require("../model/userModel");

const router = express.Router();

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        if (doctor) {
            res.status(200).send({
                success: true,
                message: "Doctor information fetched successfully",
                data: doctor,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "Doctor not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getting doctor information",
            error,
        });
    }
});
router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.body.doctorId });
        if (doctor) {
            res.status(200).send({
                success: true,
                message: "Doctor information fetched successfully",
                data: doctor,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "Doctor not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getting doctor information",
            error,
        });
    }
});
router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ userId: req.body.userId }, req.body);
        if (doctor) {
            res.status(200).send({
                success: true,
                message: "Doctor profile updated successfully",
                data: doctor,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "Doctor not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while updating doctor profile",
            error,
        });
    }
});
router.get(
    "/get-appointments-by-doctor-id",
    authMiddleware,
    async (req, res) => {
      try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });
        const appointments = await Appointment.find({ doctorId: doctor._id });
        res.status(200).send({
          message: "Appointments fetched successfully",
          success: true,
          data: appointments,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          message: "Error fetching appointments",
          success: false,
          error,
        });
      }
    }
  );
  
  router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
      const { appointmentId, status } = req.body;
      const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
        status,
      });
  
      const user = await User.findOne({ _id: appointment.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "appointment-status-changed",
        message: `Your appointment status has been ${status}`,
        onClickPath: "/appointments",
      });
  
      await user.save();
  
      res.status(200).send({
        message: "Appointment status updated successfully",
        success: true
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error changing appointment status",
        success: false,
        error,
      });
    }
  });

module.exports = router;
