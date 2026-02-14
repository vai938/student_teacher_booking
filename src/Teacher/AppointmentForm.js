import React, { useEffect, useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../Firebase";
import "./AppointmentForm.css";

const AppointmentForm = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => document.body.classList.remove("dark-mode");
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!date || !time || !reason) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        date,
        time,
        reason,
        status: "Pending",
        createdAt: Timestamp.now(),
        createdBy: "teacher", // later you can replace with auth uid
      });

      alert("Appointment scheduled successfully");

      setDate("");
      setTime("");
      setReason("");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert(error.message);
    }
  };

  return (
    <div className="appt-wrapper">
      <section className="appt-card">
        <h1 className="appt-title">Schedule Appointment</h1>
        <p className="appt-subtitle">
          Choose a suitable date and time, and briefly describe the reason.
        </p>

        <form className="appt-form" onSubmit={handleFormSubmit}>
          <div className="appt-row">
            <div className="appt-field">
              <label htmlFor="appt-date">Date</label>
              <input
                id="appt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="appt-field">
              <label htmlFor="appt-time">Time</label>
              <input
                id="appt-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="appt-field">
            <label htmlFor="appt-reason">Reason for appointment</label>
            <textarea
              id="appt-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              placeholder="e.g. exam doubts, project discussion, guidance..."
            />
          </div>

          <div className="appt-actions">
            <button type="submit" className="appt-btn">
              Schedule Appointment
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AppointmentForm;
