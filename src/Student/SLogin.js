import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword2,
  signInWithGoogle,
} from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./SLogin.css";

function SLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, authError] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/student");
  }, [user, loading, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const res = await logInWithEmailAndPassword2(email, password);
      if (res?.user) {
        navigate("/student");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigate("/student");
      }
    } catch (err) {
      setErrorMsg(err.message || "Google sign in failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Role Switcher Tabs */}
        <div className="auth-role-tabs">
          <Link to="/slogin" className="auth-role-tab active">
            Student
          </Link>
          <Link to="/tlogin" className="auth-role-tab">
            Teacher
          </Link>
          <Link to="/login" className="auth-role-tab">
            Admin
          </Link>
        </div>

        <h2 className="auth-title">Student Portal Login</h2>
        <p className="auth-subtitle">
          Sign in to discover faculty, reserve office hours, and track consultations.
        </p>

        {(errorMsg || authError) && (
          <div className="auth-error">
            {errorMsg || authError?.message || "Something went wrong. Please try again."}
          </div>
        )}

        {/* Google One-Click Login */}
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
          <span>Continue with Google</span>
        </button>

        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        <form onSubmit={handleEmailLogin} className="auth-fields">
          <div className="auth-input-group">
            <label htmlFor="s-email">Email Address</label>
            <input
              id="s-email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              required
            />
          </div>

          <div className="auth-input-group">
            <div className="label-with-link">
              <label htmlFor="s-password">Password</label>
              <Link to="/sreset" className="auth-sub-link">
                Forgot password?
              </Link>
            </div>
            <input
              id="s-password"
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
            {isSubmitting ? "Signing in..." : "Sign in as Student →"}
          </button>
        </form>

        <div className="auth-card-footer">
          <span className="auth-text">Don&apos;t have an account yet? </span>
          <Link to="/sregister" className="auth-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SLogin;
