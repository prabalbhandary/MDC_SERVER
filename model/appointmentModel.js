const mongoose = require("mongoose")
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    doctorInfo: {
        type: Object,
        required: true
    },
    userInfo: {
        type: Object,
        required: true
    },
    date: {
        type: Object,
        required: true
    },
    time: {
        type: Array,
        required: true
    },
    status: {
        type: Object,
        required: true,
        default: "pending"
    }
}, {timestamps: true})

const Appointment = mongoose.model("appointment", appointmentSchema)

module.exports = Appointment
