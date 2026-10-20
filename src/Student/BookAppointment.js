import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./BookAppointment.css";

function BookAppointment({
  selectedTeacher,
  onBookingSuccess,
  onClearTeacher,
  showOnlyAppointments,
  onGoToSearch,
}) {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [reason, setReason] = useState("");
  const [myAppointments, setMyAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Auto-fill student name
  useEffect(() => {
    if (user && !name) {
      setName(user.displayName || user.email?.split("@")[0] || "");
    }
  }, [user, name]);

  // Sync selectedTeacher prop
  useEffect(() => {
    if (selectedTeacher) {
      if (selectedTeacher.department) setDepartment(selectedTeacher.department);
      if (selectedTeacher.subject) setSubject(selectedTeacher.subject);
      if (selectedTeacher.name) setTeacherName(selectedTeacher.name);
    }
  }, [selectedTeacher]);

  // Real-time listener for current student's appointments
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
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          // Client-side sort by date descending
          list.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
          });
          setMyAppointments(list);
        },
        (err) => console.warn("Appointments listener error:", err)
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn("Error subscribing:", e);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !department.trim() || !subject.trim() || !date) {
      setFeedbackMsg("Please fill in all required fields (Name, Department, Subject, and Date).");
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg("");

    try {
      await addDoc(collection(db, "appointments"), {
        studentName: name.trim(),
        studentEmail: user?.email || "",
        studentUid: user?.uid || "",
        teacherName: teacherName.trim() || "Assigned Faculty",
        department: department.trim(),
        subject: subject.trim(),
        date,
        time: time || "10:00 AM",
        reason: reason.trim() || "Academic Consultation",
        status: "Pending",
        createdAt: Timestamp.now(),
      });

      setSubject("");
      setDate("");
      setReason("");
      if (onClearTeacher) onClearTeacher();
      if (onBookingSuccess) onBookingSuccess();
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setFeedbackMsg(error.message || "Could not book appointment. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment request?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "appointments", id));
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert(err.message || "Failed to cancel appointment");
    }
  };

  // Filter appointments
  const filteredAppointments = myAppointments.filter((a) => {
    if (statusFilter === "all") return true;
    return (a.status || "Pending").toLowerCase() === statusFilter.toLowerCase();
  });

  // Render ONLY appointments view
  if (showOnlyAppointments) {
    return (
      <div className="appointments-management-area">
        <div className="section-title-bar">
          <div>
            <h2 className="area-title">My Consultation History</h2>
            <p className="area-subtitle">
              Track real-time approval status for scheduled sessions with your instructors.
            </p>
          </div>

          <div className="status-filter-pills">
            <button
              type="button"
              className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({myAppointments.length})
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending (
              {myAppointments.filter((a) => (a.status || "Pending") === "Pending").length}
              )
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === "approved" ? "active" : ""}`}
              onClick={() => setStatusFilter("approved")}
            >
              Approved ({myAppointments.filter((a) => a.status === "Approved").length})
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === "completed" ? "active" : ""}`}
              onClick={() => setStatusFilter("completed")}
            >
              Completed ({myAppointments.filter((a) => a.status === "Completed").length})
            </button>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="appointments-empty-box">
            <div className="empty-icon">📅</div>
            <h3>No appointments found</h3>
            <p>
              {myAppointments.length === 0
                ? "You haven't requested any consultations yet. Browse the faculty directory to pick an instructor."
                : `No appointments match the "${statusFilter}" filter.`}
            </p>
            {onGoToSearch && (
              <button type="button" className="btn-action-primary" onClick={onGoToSearch}>
                Find a Faculty Member →
              </button>
            )}
          </div>
        ) : (
          <div className="appointments-cards-list">
            {filteredAppointments.map((appt) => {
              const statusClass = (appt.status || "Pending").toLowerCase();
              return (
                <div key={appt.id} className="appointment-card">
                  <div className="appt-date-block">
                    <span className="appt-date-text">{appt.date}</span>
                    <span className="appt-time-text">{appt.time || "10:00 AM"}</span>
                  </div>

                  <div className="appt-details-block">
                    <div className="appt-top-line">
                      <h4 className="appt-instructor">{appt.teacherName || "Assigned Teacher"}</h4>
                      <span className={`status-pill ${statusClass}`}>{appt.status || "Pending"}</span>
                    </div>

                    <div className="appt-dept-line">
                      <span>{appt.department}</span>
                      <span aria-hidden="true">·</span>
                      <span className="appt-subject">{appt.subject}</span>
                    </div>

                    {appt.reason && (
                      <p className="appt-reason-text">"{appt.reason}"</p>
                    )}
                  </div>

                  <div className="appt-actions-block">
                    {statusClass === "pending" && (
                      <button
                        type="button"
                        className="btn-cancel-appt"
                        onClick={() => handleCancelAppointment(appt.id)}
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Booking Form View
  return (
    <div className="booking-form-container">
      <div className="booking-card">
        <h2 className="booking-card-title">Schedule a Consultation</h2>
        <p className="booking-card-subtitle">
          Submit your appointment request directly to the instructor's schedule.
        </p>

        {/* Selected Teacher Banner */}
        {selectedTeacher && (
          <div className="selected-teacher-banner">
            <div className="selected-info">
              <span className="selected-tag">Selected Faculty</span>
              <strong>{selectedTeacher.name}</strong>
              <span className="selected-sub">
                {selectedTeacher.department} · {selectedTeacher.subject}
              </span>
            </div>
            {onClearTeacher && (
              <button
                type="button"
                className="btn-clear-selection"
                onClick={onClearTeacher}
              >
                Change
              </button>
            )}
          </div>
        )}

        {feedbackMsg && (
          <div className="form-feedback-alert">{feedbackMsg}</div>
        )}

        <form className="consultation-form" onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="student-name">Student Name *</label>
              <input
                id="student-name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="teacher-target">Faculty Instructor</label>
              <input
                id="teacher-target"
                type="text"
                placeholder="e.g. Dr. Robert Chen (or Assigned Faculty)"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="dept-name">Academic Department *</label>
              <input
                id="dept-name"
                type="text"
                placeholder="e.g. Computer Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="subject-name">Course / Subject *</label>
              <input
                id="subject-name"
                type="text"
                placeholder="e.g. Advanced Algorithms"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="consult-date">Preferred Date *</label>
              <input
                id="consult-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="consult-time">Preferred Time Slot *</label>
              <select
                id="consult-time"
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
            <label htmlFor="consult-reason">Topic / Consultation Agenda</label>
            <textarea
              id="consult-reason"
              rows={3}
              placeholder="Briefly state your discussion topic, project doubts, or questions..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>

          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-submit-consultation"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting Booking..." : "Confirm & Book Consultation →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
