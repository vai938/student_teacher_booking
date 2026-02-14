import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword1,
  signInWithGoogle,
} from "../Firebase";
import "./TRegister.css";

function TRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const register = () => {
    if (!name) {
      alert("Please enter your full name");
      return;
    }
    registerWithEmailAndPassword1(name, email, password);
  };

  // keep teacher area in dark mode
  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => document.body.classList.remove("dark-mode");
  }, []);

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/tdashboard");
  }, [user, loading, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Teacher Registration</h2>
        <p className="auth-subtitle">
          Create your teacher account to manage and review appointments.
        </p>

        <div className="auth-fields">
          <input
            type="text"
            className="auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <button className="auth-btn primary" onClick={register}>
          Register
        </button>

        <div className="auth-divider">or</div>

        <button className="auth-btn google" onClick={signInWithGoogle}>
          <span className="google-icon">G</span>
          <span>Register with Google</span>
        </button>

        <div className="auth-links">
          <span className="auth-text">Already have an account?</span>
          <Link to="/tlogin" className="auth-link">
            Login
          </Link>
          <span className="auth-text">now.</span>
        </div>
      </div>
    </div>
  );
}

export default TRegister;
