import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./TDashboard.css";
import { auth, db, logout } from "../Firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function TDashboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      if (!user) return;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docsSnap = await getDocs(q);

      if (!docsSnap.empty) {
        const data = docsSnap.docs[0].data();
        setName(data.name || "");
      } else {
        console.warn("No user document found for uid", user.uid);
      }
    } catch (err) {
      console.error("Error fetching teacher user data:", err);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/tlogin");
      return;
    }
    fetchUserName();
  }, [user, loading, navigate]);

  // enforce dark mode for teacher area
  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => document.body.classList.remove("dark-mode");
  }, []);

  if (!user) return null;

  return (
    <div className="t-dashboard-wrapper">
      <div className="t-dashboard-card">
        <p className="t-dashboard-label">Teacher signed in as</p>
        {name && <h2 className="t-dashboard-name">{name}</h2>}
        <p className="t-dashboard-email">{user.email}</p>

        <button className="t-dashboard-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default TDashboard;
