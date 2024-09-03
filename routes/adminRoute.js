const express = require("express");
const User = require("../model/userModel");
const Doctor = require("../model/doctorModel");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error", error });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error", error });
  }
});

router.post("/change-doctor-account-status", authMiddleware, async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    const doctorUpdateResult = await Doctor.findByIdAndUpdate(doctorId, { status }, { new: true });
    if (!doctorUpdateResult) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    const user = await User.findOne({_id: doctorUpdateResult.userId});
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const unseenNotifications = user.unseenNotifications || [];
    unseenNotifications.push({
      type: "new-doctor-request-changed",
      message: `Your doctor account has been ${status}`,
      onClickPath: "/notifications",
    });
    user.isDoctor = status === "approved" ? true : false

    await user.save()

    res.status(200).send({
      success: true,
      message: "Doctor status updated successfully",
      data: doctorUpdateResult,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error", error });
  }
});

module.exports = router;
