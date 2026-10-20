import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";
import "./SearchTeacher.css";

function SearchTeacher({ onSelectTeacher }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [allTeachers, setAllTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to faculty directory in real time
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "teachers"),
        (snapshot) => {
          const list = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          setAllTeachers(list);
          setLoading(false);
        },
        (err) => {
          console.warn("Could not load teachers in realtime:", err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Error subscribing to teachers:", e);
      setLoading(false);
    }
  }, []);

  // Compute unique departments
  const departments = Array.from(
    new Set(allTeachers.map((t) => t.department).filter(Boolean))
  );

  // Filter teachers by search term and selected department
  const filteredTeachers = allTeachers.filter((t) => {
    const matchesDept =
      selectedDept === "all" ||
      (t.department && t.department.toLowerCase() === selectedDept.toLowerCase());

    if (!searchTerm.trim()) return matchesDept;

    const term = searchTerm.toLowerCase();
    const nameMatch = t.name && t.name.toLowerCase().includes(term);
    const deptMatch = t.department && t.department.toLowerCase().includes(term);
    const subjMatch = t.subject && t.subject.toLowerCase().includes(term);

    return matchesDept && (nameMatch || deptMatch || subjMatch);
  });

  return (
    <div className="search-teacher-container">
      {/* Search & Filter Bar */}
      <div className="search-control-card">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by faculty name, department, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Department Filter Chips */}
        {departments.length > 0 && (
          <div className="dept-chips-row">
            <button
              type="button"
              className={`dept-chip ${selectedDept === "all" ? "active" : ""}`}
              onClick={() => setSelectedDept("all")}
            >
              All Departments ({allTeachers.length})
            </button>
            {departments.map((dept) => {
              const count = allTeachers.filter((t) => t.department === dept).length;
              return (
                <button
                  key={dept}
                  type="button"
                  className={`dept-chip ${selectedDept.toLowerCase() === dept.toLowerCase() ? "active" : ""}`}
                  onClick={() => setSelectedDept(dept)}
                >
                  {dept} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Directory Grid */}
      <div className="directory-results-area">
        {loading && (
          <div className="directory-empty-state">
            <div className="spinner"></div>
            <p>Loading faculty directory...</p>
          </div>
        )}

        {!loading && filteredTeachers.length === 0 && (
          <div className="directory-empty-state">
            <div className="empty-icon">📂</div>
            <h3>No faculty members found</h3>
            <p>
              {allTeachers.length === 0
                ? "No instructors have been added to the system yet. Faculty admin can register teachers in the Admin Portal."
                : "No instructors matched your current search filters. Try adjusting your keywords."}
            </p>
            {(searchTerm || selectedDept !== "all") && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDept("all");
                }}
              >
                Reset Search Filters
              </button>
            )}
          </div>
        )}

        {!loading && filteredTeachers.length > 0 && (
          <div className="faculty-grid">
            {filteredTeachers.map((teacher, idx) => {
              const initials = (teacher.name || "T")
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div key={teacher.id || idx} className="faculty-card">
                  <div className="faculty-card-header">
                    <div className="faculty-avatar">{initials}</div>
                    <div className="faculty-meta">
                      <h3 className="faculty-name">{teacher.name}</h3>
                      <span className="faculty-dept">{teacher.department || "Faculty"}</span>
                    </div>
                  </div>

                  <div className="faculty-subject-box">
                    <span className="subject-label">Subject Expertise:</span>
                    <span className="subject-name">{teacher.subject || "General Consultation"}</span>
                  </div>

                  <div className="faculty-card-footer">
                    <button
                      type="button"
                      className="btn-book-faculty"
                      onClick={() => onSelectTeacher && onSelectTeacher(teacher)}
                    >
                      Book Consultation →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchTeacher;
