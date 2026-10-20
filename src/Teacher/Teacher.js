import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot } from "firebase/firestore";
import { auth, db, logout } from "../Firebase";
import AppointmentForm from "./AppointmentForm";
import AppointmentList from "./AppointmentList";
import "./TDashboard.css";

function Teacher() {
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState("appointments"); // "appointments" | "schedule"
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/tlogin");
    }
  }, [user, loading, navigate]);

  // Real-time counter of appointments
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "appointments"),
        (snapshot) => {
          const list = [];
          snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setAppointments(list);
        },
        (err) => console.warn("Teacher appointments listener:", err)
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Metrics error:", e);
    }
  }, []);

  const pendingCount = appointments.filter((a) => (a.status || "Pending") === "Pending").length;
  const approvedCount = appointments.filter((a) => a.status === "Approved").length;

  if (loading || !user) {
    return (
      <div className="portal-loading">
        <div className="spinner"></div>
        <p>Loading teacher portal...</p>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <div className="app-container">
        {/* Header Bar */}
        <div className="portal-header">
          <div className="portal-user-info">
            <div className="portal-avatar teacher-avatar">
              {(user.displayName || user.email || "T")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="portal-title">
                {user.displayName || user.email?.split("@")[0]}
              </h1>
              <span className="portal-subtitle">{user.email} · Faculty Instructor</span>
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

        {/* Tab Navigation */}
        <div className="portal-nav-tabs">
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            📋 Manage Consultations ({appointments.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            ➕ Post Office Hours Availability
          </button>
        </div>

        {/* Content Body */}
        <div className="portal-content-body">
          {activeTab === "appointments" && (
            <AppointmentList
              onSwitchToSchedule={() => setActiveTab("schedule")}
            />
          )}

          {activeTab === "schedule" && (
            <AppointmentForm
              onScheduled={() => setActiveTab("appointments")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Teacher;
