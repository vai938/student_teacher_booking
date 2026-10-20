import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword1,
  signInWithGoogle,
} from "../Firebase";
import "../Student/SLogin.css";

function TRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/teacher");
  }, [user, loading, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill in your name, email, and password.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const res = await registerWithEmailAndPassword1(name.trim(), email.trim(), password);
      if (res?.user) {
        navigate("/teacher");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to register.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigate("/teacher");
      }
    } catch (err) {
      setErrorMsg(err.message || "Google sign in failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Teacher Registration</h2>
        <p className="auth-subtitle">
          Create your faculty account to post office hours and manage student appointments.
        </p>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <button
          type="button"
          className="auth-btn-google"
          onClick={handleGoogleSignIn}
        >
          <svg className="google-icon-svg" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Register with Google</span>
        </button>

        <div className="auth-divider">
          <span>or create with email</span>
        </div>

        <form onSubmit={handleRegister} className="auth-fields">
          <div className="auth-input-group">
            <label htmlFor="treg-name">Faculty Full Name</label>
            <input
              id="treg-name"
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Eleanor Vance"
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="treg-email">Instructor Email Address</label>
            <input
              id="treg-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eleanor.vance@university.edu"
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="treg-password">Password</label>
            <input
              id="treg-password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Teacher Account →"}
          </button>
        </form>

        <div className="auth-card-footer">
          <span className="auth-text">Already registered? </span>
          <Link to="/tlogin" className="auth-link">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TRegister;
