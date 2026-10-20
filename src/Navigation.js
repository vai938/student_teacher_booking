import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "./Firebase";
import "./Navigation.css";

function Navigation() {
  const [user] = useAuthState(auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="brand-zone" onClick={() => setMobileMenuOpen(false)}>
          <span className="brand-icon">🎓</span>
          <span className="brand-name">CampusConnect</span>
        </Link>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="nav-zone desktop-nav">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/student"
            className={`nav-link ${isActive("/student") || isActive("/slogin") || isActive("/sregister") ? "active" : ""}`}
          >
            Student Portal
          </Link>
          <Link
            to="/teacher"
            className={`nav-link ${isActive("/teacher") || isActive("/tlogin") || isActive("/tregister") ? "active" : ""}`}
          >
            Teacher Portal
          </Link>
          <Link
            to="/page"
            className={`nav-link ${isActive("/page") || isActive("/login") || isActive("/register") ? "active" : ""}`}
          >
            Faculty Admin
          </Link>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="action-zone desktop-action">
          {user ? (
            <div className="user-profile-badge">
              <div className="user-avatar-circle">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
              <span className="user-email-text" title={user.email}>
                {user.displayName || user.email?.split("@")[0]}
              </span>
              <button
                type="button"
                className="btn-signout"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/slogin" className="btn-signin-primary">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-nav-links">
            <Link
              to="/"
              className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/student"
              className={`mobile-nav-link ${isActive("/student") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Student Portal
            </Link>
            <Link
              to="/teacher"
              className={`mobile-nav-link ${isActive("/teacher") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Teacher Portal
            </Link>
            <Link
              to="/page"
              className={`mobile-nav-link ${isActive("/page") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Faculty Admin
            </Link>
          </div>

          <div className="mobile-drawer-footer">
            {user ? (
              <div className="mobile-user-box">
                <div className="user-profile-badge">
                  <div className="user-avatar-circle">
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="user-email-text">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-signout full-width"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link
                  to="/slogin"
                  className="btn-signin-primary full-width"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Student Login
                </Link>
                <Link
                  to="/tlogin"
                  className="btn-secondary full-width"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Teacher Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
