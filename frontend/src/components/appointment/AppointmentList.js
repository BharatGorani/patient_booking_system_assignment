import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";

const AppointmentList = ({ onEdit }) => {
  const { token, user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load appointments");
        return;
      }
      setAppointments(data);
    } catch (err) {
      setError("Server error");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete");
        return;
      }
      setAppointments(appointments.filter((a) => a._id !== id));
      alert("Appointment deleted");
    } catch (err) {
      alert("Server error");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update status");
        return;
      }
      // Update locally
      setAppointments((prev) => prev.map(a => a._id === id ? data : a));
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>Your Appointments</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              {user.role === "patient" ? <th>Doctor</th> : <th>Patient</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{new Date(a.date).toLocaleString()}</td>
                <td>{a.reason}</td>
                <td>{a.status}</td>
                <td>{user.role === "patient" ? a.doctor?.name : a.patient?.name}</td>
                <td style={{ display: "flex", gap: "0.5rem" }}>
                  {(user.role === "patient" && a.status === "scheduled") && (
                    <>
                      <button onClick={() => onEdit(a)}>Edit</button>
                      <button onClick={() => handleDelete(a._id)}>Delete</button>
                    </>
                  )}
                  {user.role === "doctor" && (
                    <>
                      <select
                        value={a.status}
                        onChange={(e) => handleStatusChange(a._id, e.target.value)}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button onClick={() => handleDelete(a._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentList;