import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db, logout } from "../Firebase";
import Main from "./Main";
import Get from "./Get";
import "./Dashboard.css";

function Page() {
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState("directory"); // "directory" | "add"
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Real-time counter of teachers
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "teachers"),
        (snapshot) => {
          const list = [];
          snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setTeachers(list);
        },
        (err) => console.warn("Admin teachers metrics listener:", err)
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Metrics error:", e);
    }
  }, []);

  const departmentsCount = new Set(teachers.map((t) => t.department).filter(Boolean)).size;

  if (loading || !user) {
    return (
      <div className="portal-loading">
        <div className="spinner"></div>
        <p>Loading administration console...</p>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <div className="app-container">
        {/* Admin Header */}
        <div className="portal-header">
          <div className="portal-user-info">
            <div className="portal-avatar admin-avatar">
              {(user.displayName || user.email || "A")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="portal-title">
                {user.displayName || user.email?.split("@")[0]}
              </h1>
              <span className="portal-subtitle">{user.email} · System Administrator</span>
            </div>
          </div>

          <div className="portal-header-actions">
            <div className="portal-stats-row">
              <div className="portal-stat-pill">
                <span className="stat-num tabular-nums">{teachers.length}</span>
                <span className="stat-text">Faculty</span>
              </div>
              <div className="portal-stat-pill success">
                <span className="stat-num tabular-nums">{departmentsCount}</span>
                <span className="stat-text">Depts</span>
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
            className={`portal-tab-btn ${activeTab === "directory" ? "active" : ""}`}
            onClick={() => setActiveTab("directory")}
          >
            🏛️ Faculty Directory ({teachers.length})
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            ➕ Register New Faculty Member
          </button>
        </div>

        {/* Content Body */}
        <div className="portal-content-body">
          {activeTab === "directory" && (
            <Get onSwitchToAdd={() => setActiveTab("add")} />
          )}

          {activeTab === "add" && (
            <Main onAdded={() => setActiveTab("directory")} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;