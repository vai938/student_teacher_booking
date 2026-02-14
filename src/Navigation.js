import React from 'react';
import './Navigation.css';

function Navigation() {
  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <a href="/" className="nav-brand">
          <span className="nav-logo">🎓</span>
          <span className="nav-title">Appointment Portal</span>
        </a>

        <nav className="nav-menu">
          <a href="/login" className="nav-link-pill">
            Admin
          </a>
          <a href="/tlogin" className="nav-link-pill">
            Teacher
          </a>
          <a href="/slogin" className="nav-link-pill">
            Student
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
