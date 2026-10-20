import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../Firebase";
import "./AppointmentForm.css";

const AppointmentForm = ({ onScheduled }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [department, setDepartment] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!date || !time || !reason.trim()) {
      setFeedback("Please fill in the date, time, and session description.");
      return;
    }

    setIsSubmitting(true);
    setFeedback("");

    try {
      await addDoc(collection(db, "appointments"), {
        date,
        time,
        department: department.trim() || "General Faculty",
        subject: "Office Hours / Open Session",
        reason: reason.trim(),
        status: "Approved", // Open slots posted by teachers are ready for students
        createdAt: Timestamp.now(),
        createdBy: auth.currentUser?.displayName || auth.currentUser?.email || "Teacher",
        teacherEmail: auth.currentUser?.email || "",
        teacherUid: auth.currentUser?.uid || "",
      });

      setDate("");
      setReason("");
      setDepartment("");
      if (onScheduled) {
        onScheduled();
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setFeedback(error.message || "Failed to post availability.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="appt-form-container">
      <div className="appt-form-card">
        <h2 className="appt-form-title">Post Office Hours &amp; Open Slots</h2>
        <p className="appt-form-subtitle">
          Publish available consultation slots for students to reserve on their portal.
        </p>

        {feedback && <div className="form-feedback-alert">{feedback}</div>}

        <form className="teacher-slot-form" onSubmit={handleFormSubmit}>
          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="teacher-slot-date">Session Date *</label>
              <input
                id="teacher-slot-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="teacher-slot-time">Session Time *</label>
              <select
                id="teacher-slot-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="09:00 AM">09:00 AM - 09:30 AM</option>
                <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                <option value="11:00 AM">11:00 AM - 11:30 AM</option>
                <option value="01:30 PM">01:30 PM - 02:00 PM</option>
                <option value="02:30 PM">02:30 PM - 03:00 PM</option>
                <option value="03:30 PM">03:30 PM - 04:00 PM</option>
                <option value="04:30 PM">04:30 PM - 05:00 PM</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="teacher-dept">Department / Faculty Division (Optional)</label>
            <input
              id="teacher-dept"
              type="text"
              placeholder="e.g. Computer Science &amp; Engineering"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="teacher-slot-reason">Session Purpose / Notes *</label>
            <textarea
              id="teacher-slot-reason"
              rows={3}
              placeholder="e.g. Open office hours for midterm questions, thesis guidance, or project reviews in Room 304..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-submit-consultation"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing Slot..." : "Publish Office Hours Slot →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
