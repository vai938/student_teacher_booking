import React, { useState, useEffect } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../Firebase";
import { Form, Button } from "react-bootstrap";
import "./BookAppointment.css";

function BookAppointment() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => document.body.classList.remove("dark-mode");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !department || !subject || !date) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        studentName: name,
        department,
        subject,
        date,
        status: "Pending",
        createdAt: Timestamp.now(),
      });

      alert("Appointment scheduled successfully");

      setName("");
      setDepartment("");
      setSubject("");
      setDate("");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert(error.message);
    }
  };

  return (
    <div className="book-wrapper">
      <section className="book-card">
        <h1 className="book-title">Book an Appointment</h1>
        <p className="book-subtitle">
          Fill in the required details to schedule an appointment.
        </p>

        <Form className="book-form" onSubmit={handleSubmit}>
          <Form.Group className="book-group">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="book-group">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="book-group">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="book-group">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>

          <div className="book-actions">
            <Button className="book-btn" type="submit">
              Schedule Appointment
            </Button>
          </div>
        </Form>
      </section>
    </div>
  );
}

export default BookAppointment;
