import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "../Firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {
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
        setName(data.name || user.displayName || user.email?.split("@")[0] || "Admin");
      } else {
        setName(user.displayName || user.email?.split("@")[0] || "Admin");
      }
    } catch (err) {
      console.warn("Could not fetch user profile document:", err);
      setName(user.displayName || user.email?.split("@")[0] || "Admin");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserName();
  }, [user, loading, navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <p className="dashboard-label">Signed in as</p>
        {name && <h2 className="dashboard-name">{name}</h2>}
        <p className="dashboard-email">{user.email}</p>

        <button className="dashboard-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
