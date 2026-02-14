import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../Firebase";
import "./TRegister.css"; // reuse the same glass auth styles

function TReset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return navigate("/tdashboard"); // teacher dashboard after login
  }, [user, loading, navigate]);

  // keep teacher auth pages in dark mode
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
          Enter your email address and we&apos;ll send you a reset link.
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
          <Link to="/tregister" className="auth-link">
            Register
          </Link>
          <span className="auth-text">now.</span>
        </div>
      </div>
    </div>
  );
}

export default TReset;
