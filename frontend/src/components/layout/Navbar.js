import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", backgroundColor: "#4a90e2", color: "white", display: "flex", justifyContent: "space-between" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Patient Appointment System
      </Link>
      <div>
        {!isAuthenticated ? (
          <>
            <Link to="/login" style={{ color: "white", marginRight: "1rem" }}>Login</Link>
            <Link to="/signup" style={{ color: "white" }}>Signup</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: "1rem" }}>Hello, {user.name} ({user.role})</span>
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;