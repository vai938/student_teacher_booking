import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithGoogle,
} from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  // redirect if already logged in
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/page");
  }, [user, loading, navigate]);

  // initialise theme from body (if you came from landing page)
  useEffect(() => {
    const hasDark = document.body.classList.contains("dark-mode");
    setDarkMode(hasDark);
  }, []);

  // whenever darkMode changes, update body class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleEmailLogin = () => {
    if (!email || !password) return;
    signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <div className={`auth-page ${darkMode ? "dark" : ""}`}>

      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">
          Sign in to continue to the Student–Teacher Booking Platform.
        </p>

        {error && (
          <div className="auth-error">
            {error.message || "Something went wrong. Please try again."}
          </div>
        )}

        <div className="auth-fields">
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail address"
          />
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <button className="auth-btn primary" onClick={handleEmailLogin}>
          Login
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="auth-btn google" onClick={signInWithGoogle}>
          <span className="google-icon">G</span>
          <span>Login with Google</span>
        </button>

        <div className="auth-links">
          <Link to="/reset" className="auth-link">
            Forgot password?
          </Link>
          <span className="auth-link-separator">•</span>
          <span className="auth-text">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
