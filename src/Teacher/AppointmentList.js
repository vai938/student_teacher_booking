import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  query,
} from "firebase/firestore";
import { db } from "../Firebase";
import "./AppointmentList.css";

function AppointmentList({ onSwitchToSchedule }) {
  const [appointments, setAppointments] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "appointments"));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const data = {};
          querySnapshot.forEach((docSnap) => {
            data[docSnap.id] = docSnap.data();
          });
          setAppointments(data);
          setLoading(false);
        },
        (error) => {
          console.warn("Realtime listener error:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Could not bind listener:", err);
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment record?")) {
      return;
    }
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message);
    }
  };

  const entries = Object.entries(appointments);

  // Client-side sort by date descending
  entries.sort(([, a], [, b]) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  // Filter entries
  const filteredEntries = entries.filter(([, val]) => {
    const status = (val.status || "Pending").toLowerCase();
    const matchesFilter =
      statusFilter === "all" || status === statusFilter.toLowerCase();

    if (!searchQuery.trim()) return matchesFilter;

    const q = searchQuery.toLowerCase();
    const nameMatch = (val.studentName || val.createdBy || "").toLowerCase().includes(q);
    const emailMatch = (val.studentEmail || "").toLowerCase().includes(q);
    const deptMatch = (val.department || "").toLowerCase().includes(q);
    const subjMatch = (val.subject || val.reason || "").toLowerCase().includes(q);

    return matchesFilter && (nameMatch || emailMatch || deptMatch || subjMatch);
  });

  const pendingCount = entries.filter(([, v]) => (v.status || "Pending") === "Pending").length;
  const approvedCount = entries.filter(([, v]) => v.status === "Approved").length;
  const completedCount = entries.filter(([, v]) => v.status === "Completed").length;

  return (
    <div className="appt-list-wrapper">
      {/* Title & Filter Bar */}
      <div className="appt-list-toolbar">
        <div>
          <h2 className="toolbar-title">Consultation Requests &amp; Schedule</h2>
          <p className="toolbar-subtitle">
            Review incoming student bookings and update consultation states.
          </p>
        </div>

        <div className="toolbar-filters">
          <div className="toolbar-search">
            <span className="search-ico">🔍</span>
            <input
              type="text"
              placeholder="Filter by student, subject, dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="status-tab-group">
            <button
              type="button"
              className={`status-tab ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({entries.length})
            </button>
            <button
              type="button"
              className={`status-tab ${statusFilter === "pending" ? "active" : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              className={`status-tab ${statusFilter === "approved" ? "active" : ""}`}
              onClick={() => setStatusFilter("approved")}
            >
              Approved ({approvedCount})
            </button>
            <button
              type="button"
              className={`status-tab ${statusFilter === "completed" ? "active" : ""}`}
              onClick={() => setStatusFilter("completed")}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="appt-empty-state">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      )}

      {!loading && filteredEntries.length === 0 && (
        <div className="appt-empty-state">
          <div className="empty-ico">📋</div>
          <h3>No appointments found</h3>
          <p>
            {entries.length === 0
              ? "You don't have any consultation bookings yet. You can also post open office hour slots."
              : `No consultations match "${searchQuery || statusFilter}".`}
          </p>
          {onSwitchToSchedule && (
            <button
              type="button"
              className="btn-primary-action"
              onClick={onSwitchToSchedule}
            >
              Post Open Office Hours →
            </button>
          )}
        </div>
      )}

      {!loading && filteredEntries.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="appt-table-card desktop-view-only">
            <table className="teacher-appt-table">
              <thead>
                <tr>
                  <th>Session Date &amp; Time</th>
                  <th>Student Info</th>
                  <th>Department / Subject</th>
                  <th>Consultation Topic</th>
                  <th>Status</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(([id, value]) => {
                  const status = value.status || "Pending";
                  const statusClass = status.toLowerCase();

                  return (
                    <tr key={id}>
                      <td>
                        <div className="session-date-time">
                          <strong>{value.date || "N/A"}</strong>
                          <span className="session-time">{value.time || "10:00 AM"}</span>
                        </div>
                      </td>

                      <td>
                        <div className="student-profile-cell">
                          <span className="student-name">
                            {value.studentName || value.createdBy || "Student"}
                          </span>
                          {value.studentEmail && (
                            <span className="student-email">{value.studentEmail}</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="dept-subject-cell">
                          <span className="dept-tag">{value.department || "General"}</span>
                          <span className="subject-title">{value.subject || "Consultation"}</span>
                        </div>
                      </td>

                      <td className="reason-cell">
                        <span className="reason-text" title={value.reason}>
                          {value.reason || value.subject || "Academic Discussion"}
                        </span>
                      </td>

                      <td>
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          className={`status-select-pill ${statusClass}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td>
                        <div className="table-actions-cell">
                          {status === "Pending" && (
                            <button
                              type="button"
                              className="btn-quick-approve"
                              onClick={() => handleStatusChange(id, "Approved")}
                              title="Quick Approve"
                            >
                              ✓ Approve
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-delete-row"
                            onClick={() => handleDelete(id)}
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-appt-cards mobile-view-only">
            {filteredEntries.map(([id, value]) => {
              const status = value.status || "Pending";
              const statusClass = status.toLowerCase();

              return (
                <div key={id} className="mobile-appt-card">
                  <div className="mobile-card-top">
                    <div>
                      <span className="mobile-date">{value.date || "N/A"}</span>
                      <span className="mobile-time"> · {value.time || "10:00 AM"}</span>
                    </div>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(id, e.target.value)}
                      className={`status-select-pill ${statusClass}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="mobile-card-body">
                    <h4 className="mobile-student-name">
                      {value.studentName || value.createdBy || "Student"}
                    </h4>
                    {value.studentEmail && (
                      <span className="mobile-student-email">{value.studentEmail}</span>
                    )}

                    <div className="mobile-dept-row">
                      <span>{value.department || "General"}</span>
                      <span aria-hidden="true">·</span>
                      <strong>{value.subject || "Consultation"}</strong>
                    </div>

                    {value.reason && (
                      <p className="mobile-reason">"{value.reason}"</p>
                    )}
                  </div>

                  <div className="mobile-card-actions">
                    {status === "Pending" && (
                      <button
                        type="button"
                        className="btn-quick-approve"
                        onClick={() => handleStatusChange(id, "Approved")}
                      >
                        ✓ Approve
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-delete-row-mobile"
                      onClick={() => handleDelete(id)}
                    >
                      Delete Record
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default AppointmentList;
