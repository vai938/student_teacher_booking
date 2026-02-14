import React from 'react';
import './WelcomePage.css';

function WelcomePage() {
  const [darkMode, setDarkMode] = React.useState(true);

  // Add/remove a body class so navbar also reacts
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className={`welcome-page ${darkMode ? 'dark' : ''}`}>
      {/* Dark mode toggle floating button */}
      <div className="theme-toggle-wrapper">
        <button
          className={`theme-toggle ${darkMode ? 'on' : ''}`}
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          <span className="theme-icon">{darkMode ? '🌙' : '☀️'}</span>
          <span className="theme-label">{darkMode ? 'Dark mode' : 'Light mode'}</span>
          <span className="theme-pill">
            <span className="theme-knob" />
          </span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="badge">SMART • SIMPLE • FAST</span>
          <h1>
            Student–Teacher
            <span> Booking Platform</span>
          </h1>
          <p className="hero-subtitle">
            Schedule meetings in seconds, avoid long queues, and keep every
            student–teacher conversation organized in one place.
          </p>

          <div className="hero-actions">
            <button
              className="btn primary"
              onClick={() => (window.location.href = '/login')}
            >
              Get Started
            </button>
            <button
              className="btn ghost"
              onClick={() => (window.location.href = '/about')}
            >
              Learn More
            </button>
          </div>

          <div className="hero-meta">
            <div>
              <h3>24/7</h3>
              <p>Accessible anywhere</p>
            </div>
            <div>
              <h3>0</h3>
              <p>Paperwork needed</p>
            </div>
            <div>
              <h3>Real-time</h3>
              <p>Notifications &amp; updates</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="card card-main">
            <h3>Today&apos;s Schedule</h3>
            <ul>
              <li>
                <span className="tag tag-student">Student</span>
                <div>
                  <p className="title">Project Discussion</p>
                  <p className="time">10:30 AM • Dr. Ahmed</p>
                </div>
              </li>
              <li>
                <span className="tag tag-teacher">Teacher</span>
                <div>
                  <p className="title">Exam Doubts</p>
                  <p className="time">01:00 PM • Ms. Lee</p>
                </div>
              </li>
              <li>
                <span className="tag tag-online">Online</span>
                <div>
                  <p className="title">Career Guidance</p>
                  <p className="time">04:15 PM • Prof. Kumar</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="card card-pill">
            <p>“No more waiting outside staff rooms!”</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why use the booking system?</h2>
        <p className="section-subtitle">
          Designed for universities, colleges, and schools that want a smooth,
          organized way to manage student–teacher meetings.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">📅</div>
            <h3>Easy Scheduling</h3>
            <p>
              Students can view available slots and book appointments without
              emails or manual coordination.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">⏱️</div>
            <h3>Time Efficient</h3>
            <p>
              Reduce queues and overlapping bookings so teachers can focus on
              what matters: mentoring and teaching.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">🔔</div>
            <h3>Smart Reminders</h3>
            <p>
              Automatic notifications for upcoming meetings keep everyone on
              track and informed.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">🌐</div>
            <h3>Access Anywhere</h3>
            <p>
              Works on laptops, tablets, and phones so students and instructors
              can manage bookings on the go.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2>How it works</h2>

        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Choose your role</h3>
            <p>Log in as an Admin, Teacher, or Student using your account.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>View available slots</h3>
            <p>
              Teachers publish their availability; students browse and pick a
              convenient time.
            </p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Confirm &amp; meet</h3>
            <p>
              Both sides receive confirmation and reminders before the
              appointment.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bottom-cta">
        <div className="bottom-card">
          <h2>Ready to simplify your appointments?</h2>
          <p>
            Start using the Student–Teacher Booking Platform today and bring
            structure to every conversation.
          </p>
          <div className="hero-actions">
            <button
              className="btn primary"
              onClick={() => (window.location.href = '/login')}
            >
              Login / Sign Up
            </button>
            <button
              className="btn ghost"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            >
              Back to top
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Student–Teacher Booking System</p>
      </footer>
    </div>
  );
}

export default WelcomePage;
