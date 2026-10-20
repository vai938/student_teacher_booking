import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Firebase";
import "./WelcomePage.css";

function WelcomePage() {
  const [user] = useAuthState(auth);

  return (
    <div className="welcome-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          Academic Scheduling Platform
        </div>
        <h1 className="hero-headline">
          Seamless student–faculty appointments without the waiting line.
        </h1>
        <p className="hero-description">
          CampusConnect organizes office hours, academic advising, and project reviews
          into a synchronized, real-time consultation portal.
        </p>

        <div className="hero-cta-group">
          <Link to={user ? "/student" : "/slogin"} className="cta-btn primary">
            Book a Consultation
          </Link>
          <Link to={user ? "/teacher" : "/tlogin"} className="cta-btn secondary">
            Teacher Office Hours
          </Link>
        </div>

        {/* Quick KPI Bar */}
        <div className="hero-metrics-strip">
          <div className="metric-item">
            <span className="metric-number tabular-nums">100%</span>
            <span className="metric-label">Real-time sync</span>
          </div>
          <div className="metric-divider" aria-hidden="true"></div>
          <div className="metric-item">
            <span className="metric-number tabular-nums">0</span>
            <span className="metric-label">Paperwork &amp; queues</span>
          </div>
          <div className="metric-divider" aria-hidden="true"></div>
          <div className="metric-item">
            <span className="metric-number tabular-nums">24/7</span>
            <span className="metric-label">Mobile accessible</span>
          </div>
        </div>
      </section>

      {/* Role Selection / Direct Access Cards */}
      <section className="roles-section">
        <div className="section-header">
          <h2 className="section-title">Select Your Academic Portal</h2>
          <p className="section-subtitle">
            Choose your role to access your dedicated schedule, appointments, and directory.
          </p>
        </div>

        <div className="roles-grid">
          {/* Student Card */}
          <div className="role-card">
            <div className="role-icon">🎓</div>
            <h3 className="role-card-title">Student Portal</h3>
            <p className="role-card-desc">
              Browse faculty directories by department, check subject expertise, and reserve convenient consultation slots with real-time status tracking.
            </p>
            <ul className="role-features">
              <li>Instant department &amp; faculty search</li>
              <li>Pre-filled consultation requests</li>
              <li>Real-time appointment status tracker</li>
            </ul>
            <Link to={user ? "/student" : "/slogin"} className="role-card-btn">
              {user ? "Open Student Portal →" : "Sign in as Student →"}
            </Link>
          </div>

          {/* Teacher Card */}
          <div className="role-card highlight">
            <div className="role-icon">👨‍🏫</div>
            <h3 className="role-card-title">Teacher Portal</h3>
            <p className="role-card-desc">
              Schedule your availability, review incoming student consultation requests, and approve or update session statuses in real time.
            </p>
            <ul className="role-features">
              <li>Manage office hours &amp; schedule slots</li>
              <li>Approve, decline, or complete bookings</li>
              <li>Live incoming appointment updates</li>
            </ul>
            <Link to={user ? "/teacher" : "/tlogin"} className="role-card-btn primary">
              {user ? "Open Teacher Portal →" : "Sign in as Teacher →"}
            </Link>
          </div>

          {/* Admin Card */}
          <div className="role-card">
            <div className="role-icon">🏛️</div>
            <h3 className="role-card-title">Faculty Admin</h3>
            <p className="role-card-desc">
              Maintain institutional faculty records, manage departmental instructors, and ensure up-to-date course and subject assignments.
            </p>
            <ul className="role-features">
              <li>Add and update faculty profiles</li>
              <li>Organize departmental subjects</li>
              <li>Synchronized institutional directory</li>
            </ul>
            <Link to={user ? "/page" : "/login"} className="role-card-btn">
              {user ? "Open Admin Console →" : "Admin Sign In →"}
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Step Demonstration */}
      <section className="workflow-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            A frictionless three-step process built for modern academic schedules.
          </p>
        </div>

        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-badge">1</div>
            <h3 className="step-title">Discover Faculty</h3>
            <p className="step-desc">
              Search by department or subject to locate the right instructor or advisor for your academic needs.
            </p>
          </div>
          <div className="workflow-step">
            <div className="step-badge">2</div>
            <h3 className="step-title">Choose Preferred Time</h3>
            <p className="step-desc">
              Select an available date and time slot, specify your discussion topic, and submit with one click.
            </p>
          </div>
          <div className="workflow-step">
            <div className="step-badge">3</div>
            <h3 className="step-title">Live Confirmation</h3>
            <p className="step-desc">
              The teacher reviews the consultation request and updates the status from Pending to Approved in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span>🎓</span> CampusConnect Academic Platform
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} CampusConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage;
