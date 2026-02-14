import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../Firebase";
import "./AppointmentList.css";

function AppointmentList() {
  const [appointments, setAppointments] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(
          collection(db, "appointments"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = {};

        querySnapshot.forEach((docSnap) => {
          data[docSnap.id] = docSnap.data();
        });

        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments({});
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await deleteDoc(doc(db, "appointments", id));

      setAppointments((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert(error.message);
    }
  };

  const entries = Object.entries(appointments);

  return (
    <div className="appt-list-wrapper">
      <section className="appt-list-card">
        <h1 className="appt-list-title">Appointment List</h1>
        <p className="appt-list-subtitle">
          Review scheduled appointments and manage them here.
        </p>

        {entries.length === 0 ? (
          <p className="appt-list-empty">
            No appointments scheduled yet.
          </p>
        ) : (
          <div className="appt-list-table-container">
            <table className="appt-list-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th className="appt-list-actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([id, value]) => (
                  <tr key={id}>
                    <td>{value.date}</td>
                    <td>{value.time}</td>
                    <td className="appt-list-reason">
                      {value.reason}
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          (value.status || "Pending").toLowerCase()
                        }`}
                      >
                        {value.status || "Pending"}
                      </span>
                    </td>
                    <td className="appt-list-actions">
                      <button
                        className="appt-list-delete-btn"
                        onClick={() => handleDelete(id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AppointmentList;
