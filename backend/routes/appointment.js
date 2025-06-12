const express = require("express");
const Appointment = require("../models/appointment");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Create appointment
router.post("/", authenticate, authorizeRoles("patient"), async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;
    if (!doctorId || !date || !reason) {
      return res.status(400).json({ error: "doctorId, date, and reason are required" });
    }
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date,
      reason
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get appointments based on user role

// Patients: only their appointments
// Doctors: all their patients' appointments

router.get("/", authenticate, async (req, res) => {
  try {
    let appointments;
    if (req.user.role === "patient") {
      appointments = await Appointment.find({ patient: req.user._id }).populate("doctor", "name email");
    } else if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctor: req.user._id }).populate("patient", "name email");
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get single appointment
router.get("/:id", authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("patient doctor", "name email");
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    if (req.user.role === "patient" && !appointment.patient._id.equals(req.user._id)) {
      return res.status(403).json({ error: "Access denied" });
    }
    if (req.user.role === "doctor" && !appointment.doctor._id.equals(req.user._id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update appointment (reschedule or update reason or status)
// Patients can update only their appointments and only date and reason before appointment date
// Doctors can update appointment status (e.g. completed, cancelled)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    if (req.user.role === "patient") {
      if (!appointment.patient.equals(req.user._id)) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Only allow updating date and reason
      const { date, reason } = req.body;
      if (date && new Date(date) < new Date()) {
        return res.status(400).json({ error: "Cannot reschedule to past date" });
      }
      if (date) appointment.date = date;
      if (reason) appointment.reason = reason;
      await appointment.save();
      return res.json(appointment);
    }

    if (req.user.role === "doctor") {
      if (!appointment.doctor.equals(req.user._id)) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (req.body.status && ["scheduled", "completed", "cancelled"].includes(req.body.status)) {
        appointment.status = req.body.status;
        await appointment.save();
        return res.json(appointment);
      } else {
        return res.status(400).json({ error: "Invalid status" });
      }
    }

    res.status(403).json({ error: "Access denied" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete appointment
// Patients and doctors can delete only their own appointments
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    if (req.user.role === "patient" && !appointment.patient.equals(req.user._id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (req.user.role === "doctor" && !appointment.doctor.equals(req.user._id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    await appointment.remove();
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;