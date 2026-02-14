import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../Firebase";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const register = () => {
    if (!name) return alert("Please enter your name");
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  // Always enable dark UI for auth screens
  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => document.body.classList.remove("dark-mode");
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create an Account</h2>
        <p className="auth-subtitle">Register to access your dashboard</p>

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

        <button className="auth-btn google" onClick={signInWithGoogle}>
          Register with Google
        </button>

        <div className="auth-links">
          <span className="auth-text">Already have an account?</span>
          <Link to="/" className="auth-link">
            Login
          </Link>
          <span className="auth-text">now.</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
