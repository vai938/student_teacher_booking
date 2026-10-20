import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, sendPasswordReset1 } from "../Firebase";
import "../Student/SLogin.css";

function TReset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return navigate("/teacher");
  }, [user, loading, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your instructor email address.");
      return;
    }
    setErrorMsg("");
    setStatusMsg("");
    setIsSubmitting(true);
    try {
      await sendPasswordReset1(email.trim());
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
        <h2 className="auth-title">Reset Teacher Password</h2>
        <p className="auth-subtitle">
          Enter your instructor email to receive password reset instructions.
        </p>

        {statusMsg && <div className="portal-stat-pill success" style={{ marginBottom: "1rem", display: "block", textAlign: "center" }}>{statusMsg}</div>}
        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <form onSubmit={handleReset} className="auth-fields">
          <div className="auth-input-group">
            <label htmlFor="treset-email">Instructor Email Address</label>
            <input
              id="treset-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="faculty@university.edu"
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
          <Link to="/tlogin" className="auth-link">
            ← Back to Teacher Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TReset;
