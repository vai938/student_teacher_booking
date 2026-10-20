import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";
import EditComponent from "./EditComponent";
import DeleteComponent from "./DeleteComponent";
import "./Get.css";

function Get({ onSwitchToAdd }) {
  const [data, setData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "teachers"),
      (querySnapshot) => {
        const teachers = {};
        querySnapshot.forEach((docSnap) => {
          teachers[docSnap.id] = docSnap.data();
        });
        setData(teachers);
        setLoading(false);
      },
      (error) => {
        console.warn("Could not listen to teachers collection:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const entries = Object.entries(data);

  // Compute departments
  const departments = Array.from(
    new Set(entries.map(([, t]) => t.department).filter(Boolean))
  );

  // Filter entries
  const filteredEntries = entries.filter(([, teacher]) => {
    const matchesDept =
      selectedDept === "all" ||
      (teacher.department &&
        teacher.department.toLowerCase() === selectedDept.toLowerCase());

    if (!searchQuery.trim()) return matchesDept;

    const q = searchQuery.toLowerCase();
    const nameMatch = (teacher.name || "").toLowerCase().includes(q);
    const deptMatch = (teacher.department || "").toLowerCase().includes(q);
    const subjMatch = (teacher.subject || "").toLowerCase().includes(q);

    return matchesDept && (nameMatch || deptMatch || subjMatch);
  });

  return (
    <div className="get-wrapper">
      {/* Search & Filter Card */}
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-header">
          <div>
            <h2 className="toolbar-title">Institutional Faculty Directory</h2>
            <p className="toolbar-subtitle">
              Manage instructors, departments, and course subjects available for booking.
            </p>
          </div>

          {onSwitchToAdd && (
            <button
              type="button"
              className="btn-add-faculty-cta"
              onClick={onSwitchToAdd}
            >
              + Add Faculty Member
            </button>
          )}
        </div>

        <div className="admin-search-row">
          <div className="admin-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by instructor name, department, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {departments.length > 0 && (
            <div className="admin-dept-pills">
              <button
                type="button"
                className={`admin-dept-pill ${selectedDept === "all" ? "active" : ""}`}
                onClick={() => setSelectedDept("all")}
              >
                All Departments ({entries.length})
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  className={`admin-dept-pill ${selectedDept.toLowerCase() === dept.toLowerCase() ? "active" : ""}`}
                  onClick={() => setSelectedDept(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="admin-empty-card">
          <div className="spinner"></div>
          <p>Loading faculty records...</p>
        </div>
      )}

      {!loading && filteredEntries.length === 0 && (
        <div className="admin-empty-card">
          <div className="empty-ico">🏛️</div>
          <h3>No faculty records found</h3>
          <p>
            {entries.length === 0
              ? "There are currently no instructors registered in the directory. Click below to add the first faculty member."
              : `No instructors match "${searchQuery || selectedDept}".`}
          </p>
          {onSwitchToAdd && (
            <button
              type="button"
              className="btn-action-primary"
              onClick={onSwitchToAdd}
            >
              Register Faculty Member →
            </button>
          )}
        </div>
      )}

      {!loading && filteredEntries.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="admin-table-card desktop-view-only">
            <table className="admin-faculty-table">
              <thead>
                <tr>
                  <th>Faculty Instructor</th>
                  <th>Department</th>
                  <th>Subject Expertise</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(([id, teacher]) => {
                  const initials = (teacher.name || "T")
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={id}>
                      <td>
                        <div className="faculty-row-info">
                          <div className="faculty-mini-avatar">{initials}</div>
                          <span className="faculty-row-name">{teacher.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="faculty-row-dept">
                          {teacher.department || "Faculty"}
                        </span>
                      </td>
                      <td>
                        <span className="faculty-row-subject">
                          {teacher.subject || "General Consultation"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <EditComponent
                            id={id}
                            name={teacher.name}
                            department={teacher.department}
                            subject={teacher.subject}
                          />
                          <DeleteComponent id={id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-faculty-cards mobile-view-only">
            {filteredEntries.map(([id, teacher]) => (
              <div key={id} className="mobile-faculty-item">
                <div className="mobile-item-header">
                  <h4 className="mobile-item-name">{teacher.name}</h4>
                  <span className="mobile-item-dept">{teacher.department}</span>
                </div>
                <div className="mobile-item-subject">
                  <span className="label">Expertise:</span> {teacher.subject}
                </div>
                <div className="mobile-item-actions">
                  <EditComponent
                    id={id}
                    name={teacher.name}
                    department={teacher.department}
                    subject={teacher.subject}
                  />
                  <DeleteComponent id={id} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Get;
