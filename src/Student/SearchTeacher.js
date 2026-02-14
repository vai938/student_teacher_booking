import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { Form, Button, Table } from "react-bootstrap";
import "./SearchTeacher.css";

function SearchTeacher() {
  const [department, setDepartment] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // keep this page in dark mode
  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => document.body.classList.remove("dark-mode");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dept = department.trim();
    if (!dept) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const q = query(
        collection(db, "teachers"),
        where("department", "==", dept)
      );

      const querySnapshot = await getDocs(q);

      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      setTeachers(results);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <section className="search-card">
        <h1 className="search-title">Find a Teacher</h1>
        <p className="search-subtitle">
          Search for teachers by department and view their subjects.
        </p>

        <Form className="search-form" onSubmit={handleSubmit}>
          <Form.Group className="search-group" controlId="searchDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Computer Science"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </Form.Group>

          <div className="search-actions">
            <Button className="search-btn" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </Form>

        <div className="search-results">
          {hasSearched && !loading && teachers.length === 0 && (
            <p className="search-empty">
              No teachers found for this department.
            </p>
          )}

          {teachers.length > 0 && (
            <div className="search-table-wrapper">
              <Table responsive hover className="search-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher, idx) => (
                    <tr key={idx}>
                      <td>{teacher.name}</td>
                      <td>{teacher.department}</td>
                      <td>{teacher.subject}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default SearchTeacher;
