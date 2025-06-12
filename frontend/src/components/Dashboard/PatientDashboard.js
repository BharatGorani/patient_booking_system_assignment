import React, { useState } from "react";
import AppointmentList from "../appointment/AppointmentList";
import AppointmentForm from "../appointment/AppointmentForm";

const PatientDashboard = () => {
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setCreating(false);
  };

  const handleCreate = () => {
    setCreating(true);
    setEditingAppointment(null);
  };

  const onSuccess = () => {
    setEditingAppointment(null);
    setCreating(false);
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: 1000, margin: "1rem auto" }}>
      <h1>Patient Dashboard</h1>
      {!creating && !editingAppointment && (
        <>
          <button onClick={handleCreate}>Book New Appointment</button>
          <AppointmentList onEdit={handleEdit} />
        </>
      )}

      {(creating || editingAppointment) && (
        <AppointmentForm appointment={editingAppointment} onSuccess={onSuccess} />
      )}
    </div>
  );
};

export default PatientDashboard;