import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db, logout } from "../Firebase";
import SearchTeacher from "./SearchTeacher";
import BookAppointment from "./BookAppointment";
import "./SDashboard.css";

function Student() {
  const [user, loading] = useAuthState(auth);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState("search"); // "search" | "book" | "appointments"
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/slogin");
    }
  }, [user, loading, navigate]);

  // Subscribe to student appointments to compute quick metrics
  useEffect(() => {
    if (!user?.email) return;
    try {
      const q = query(
        collection(db, "appointments"),
        where("studentEmail", "==", user.email)
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = [];
          snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setAppointments(list);
        },
        (err) => console.warn("Student appointments metrics listener:", err)
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Metrics error:", e);
    }
  }, [user]);

  const pendingCount = appointments.filter((a) => (a.status || "Pending") === "Pending").length;
  const approvedCount = appointments.filter((a) => a.status === "Approved").length;

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setActiveTab("book");
  };

  const handleBookingComplete = () => {
    setActiveTab("appointments");
  };

  if (loading || !user) {
    return (
      <div className="portal-loading">
        <div className="spinner"></div>
        <p>Loading student portal...</p>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <div className="app-container">
        {/* Portal Header */}
        <div className="portal-header">
          <div className="portal-user-info">
            <div className="portal-avatar">
              {(user.displayName || user.email || "S")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="portal-title">
                {user.displayName || user.email?.split("@")[0]}
              </h1>
              <span className="portal-subtitle">{user.email} · Student</span>
            </div>
          </div>

          <div className="portal-header-actions">
            <div className="portal-stats-row">
              <div className="portal-stat-pill">
                <span className="stat-num tabular-nums">{appointments.length}</span>
                <span className="stat-text">Total</span>
              </div>
              <div className="portal-stat-pill warning">
                <span className="stat-num tabular-nums">{pendingCount}</span>
                <span className="stat-text">Pending</span>
              </div>
              <div className="portal-stat-pill success">
                <span className="stat-num tabular-nums">{approvedCount}</span>
                <span className="stat-text">Approved</span>
              </div>
            </div>
            <button type="button" className="portal-logout-btn" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="portal-nav-tabs">
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            🔍 Find Faculty
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "book" ? "active" : ""}`}
            onClick={() => setActiveTab("book")}
          >
            📅 Schedule Consultation
            {selectedTeacher && <span className="tab-badge">Selected</span>}
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            📋 My Appointments ({appointments.length})
          </button>
        </div>

        {/* Main Content Area */}
        <div className="portal-content-body">
          {activeTab === "search" && (
            <SearchTeacher onSelectTeacher={handleSelectTeacher} />
          )}

          {activeTab === "book" && (
            <BookAppointment
              selectedTeacher={selectedTeacher}
              onBookingSuccess={handleBookingComplete}
              onClearTeacher={() => setSelectedTeacher(null)}
            />
          )}

          {activeTab === "appointments" && (
            <BookAppointment
              selectedTeacher={null}
              showOnlyAppointments={true}
              onGoToSearch={() => setActiveTab("search")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Student;