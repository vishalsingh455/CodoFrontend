import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Header() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="header container">
      <div className="brand">
        <div className="logo">C</div>
        <div>
          <div className="title">Codo</div>
          <div className="small">Coding competitions — beautiful & fast</div>
        </div>
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
        <button className="btn" style={{marginLeft:12}} onClick={logout}>Logout</button>
      </nav>
    </header>
  );
}
