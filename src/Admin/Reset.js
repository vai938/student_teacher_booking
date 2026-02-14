import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../Firebase";
import "./Reset.css";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return navigate("/dashboard");
  }, [user, loading, navigate]);

  // keep admin auth screens in dark mode
  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => document.body.classList.remove("dark-mode");
  }, []);

  const handleReset = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    await sendPasswordResetEmail(email);
    alert("Password reset email sent. Please check your inbox.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Reset password</h2>
        <p className="auth-subtitle">
          Enter your admin email and we&apos;ll send you a reset link.
        </p>

        <div className="auth-fields">
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
        </div>

        <button className="auth-btn primary" onClick={handleReset}>
          Send password reset email
        </button>

        <div className="auth-links">
          <span className="auth-text">Don&apos;t have an account?</span>
          <Link to="/register" className="auth-link">
            Register
          </Link>
          <span className="auth-text">now.</span>
        </div>
      </div>
    </div>
  );
}

export default Reset;
