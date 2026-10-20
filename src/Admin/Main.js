import React, { useState } from "react";
import { db } from "../Firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "./Main.css";

function Main({ onAdded }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !department.trim() || !subject.trim()) {
      setFeedback("Please fill in the instructor's name, department, and course subject.");
      return;
    }

    setIsSubmitting(true);
    setFeedback("");

    try {
      await addDoc(collection(db, "teachers"), {
        name: name.trim(),
        department: department.trim(),
        subject: subject.trim(),
        createdAt: Timestamp.now(),
      });

      setName("");
      setDepartment("");
      setSubject("");
      if (onAdded) {
        onAdded();
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      setFeedback(error.message || "Failed to register faculty member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="main-card">
        <h2 className="main-title">Register New Faculty Member</h2>
        <p className="main-subtitle">
          Add an instructor to the institutional directory so students can discover and book consultations.
        </p>

        {feedback && <div className="form-feedback-alert">{feedback}</div>}

        <form className="add-teacher-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="teacher-full-name">Faculty Full Name *</label>
            <input
              id="teacher-full-name"
              type="text"
              placeholder="e.g. Dr. Robert Chen or Prof. Sarah Miller"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="teacher-department-name">Academic Department *</label>
              <input
                id="teacher-department-name"
                type="text"
                placeholder="e.g. Computer Science &amp; Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="teacher-subject-name">Subject / Expertise Area *</label>
              <input
                id="teacher-subject-name"
                type="text"
                placeholder="e.g. Algorithms, Machine Learning"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-submit-consultation"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering Faculty..." : "Add to Directory →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Main;
