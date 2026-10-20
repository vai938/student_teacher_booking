import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../Firebase";
import "../Student/SLogin.css";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return navigate("/page");
  }, [user, loading, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your administrator email address.");
      return;
    }
    setErrorMsg("");
    setStatusMsg("");
    setIsSubmitting(true);
    try {
      await sendPasswordReset(email.trim());
      setStatusMsg("Password reset link sent! Check your inbox.");
    } catch (err) {
      setErrorMsg(err.message || "Failed to send reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Reset Administrator Password</h2>
        <p className="auth-subtitle">
          Enter your institutional admin email to receive password reset instructions.
        </p>

        {statusMsg && <div className="portal-stat-pill success" style={{ marginBottom: "1rem", display: "block", textAlign: "center" }}>{statusMsg}</div>}
        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <form onSubmit={handleReset} className="auth-fields">
          <div className="auth-input-group">
            <label htmlFor="areset-email">Admin Email Address</label>
            <input
              id="areset-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@university.edu"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Link..." : "Send Reset Link →"}
          </button>
        </form>

        <div className="auth-card-footer">
          <Link to="/login" className="auth-link">
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Reset;
