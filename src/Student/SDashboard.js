import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./SDashboard.css";
import { auth, db, logout } from "../Firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("uid", "==", user?.uid)
      );
      const docs = await getDocs(q);
      const data = docs.docs[0]?.data();
      setName(data?.name || "");
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/slogin");
    fetchUserName();
  }, [user, loading, navigate]);

  return (
    <div className="s-dashboard-wrapper">
      <section className="s-dashboard-card">
        <h2 className="s-dashboard-title">Welcome Student 🎓</h2>
        <p className="s-dashboard-subtitle">You are logged in as:</p>

        <div className="s-dashboard-info">
          <span className="s-dashboard-label">Name:</span> {name}
        </div>

        <div className="s-dashboard-info">
          <span className="s-dashboard-label">Email:</span> {user?.email}
        </div>

        <button className="s-dashboard-logout-btn" onClick={logout}>
          Logout
        </button>
      </section>
    </div>
  );
}

export default Dashboard;
