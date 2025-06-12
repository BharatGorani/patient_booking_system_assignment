import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";

const AppointmentForm = ({ appointment, onSuccess }) => {
  const { token, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    reason: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch doctors list for patient to select
    // If user is doctor, doctorId defaults to their id and is not changeable
    if (appointment) {
      setFormData({
        doctorId: appointment.doctor._id || appointment.doctor,
        date: new Date(appointment.date).toISOString().slice(0, 16),
        reason: appointment.reason,
      });
    }
  }, [appointment]);

  useEffect(() => {
    if (user.role === "patient") {
      (async function fetchDoctors() {
        try {
          // Fetch all doctors from backend
          // Ideally, a doctors endpoint should be created; here fetch users with role doctor
          const res = await fetch("http://localhost:5000/api/users/doctors", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setDoctors(data);
          }
        } catch (err) {
          console.error("Could not fetch doctors", err);
        }
      })();
    }
  }, [user, token]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      // Validate dates (must be in future)
      if (new Date(formData.date) < new Date()) {
        setError("Appointment date must be in the future");
        return;
      }

      let method = "POST";
      let url = "http://localhost:5000/api/appointments";
      let body;

      if (appointment) {
        // Update appointment (PUT)
        method = "PUT";
        url = `http://localhost:5000/api/appointments/${appointment._id}`;
        body = JSON.stringify({
          date: formData.date,
          reason: formData.reason,
        });
      } else {
        // Create appointment
        body = JSON.stringify({
          doctorId: formData.doctorId,
          date: formData.date,
          reason: formData.reason,
        });
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit");
        return;
      }
      onSuccess(data);
    } catch (err) {
      setError("Server error");
    }
  };

  if (user.role === "doctor" && !appointment) {
    return <p>Doctors cannot create appointments, only patients.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "1rem auto", display:"flex", flexDirection:"column", gap:"1rem" }}>
      {user.role === "patient" && (
        <>
          <label>Doctor</label>
          <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
            <option value="">Select Doctor</option>
            {doctors.map(doc => (
              <option key={doc._id} value={doc._id}>{doc.name} ({doc.email})</option>
            ))}
          </select>
        </>
      )}

      <label>Date & Time</label>
      <input name="date" type="datetime-local" value={formData.date} onChange={handleChange} required />

      <label>Reason</label>
      <textarea name="reason" value={formData.reason} onChange={handleChange} required></textarea>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">{appointment ? "Update Appointment" : "Book Appointment"}</button>
    </form>
  );
};

export default AppointmentForm;