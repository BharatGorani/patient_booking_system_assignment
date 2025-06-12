import React from "react";
import AppointmentList from "../appointment/AppointmentList";

const DoctorDashboard = () => {
  return (
    <div style={{ maxWidth: 1000, margin: "1rem auto" }}>
      <h1>Doctor/Admin Dashboard</h1>
      <AppointmentList />
      <p>Note: Doctors cannot create appointments but can update status and delete.</p>
    </div>
  );
};

export default DoctorDashboard;