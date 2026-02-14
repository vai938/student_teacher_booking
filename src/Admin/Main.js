import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import { collection, addDoc } from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Main.css";

function Main() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");

  // Force dark mode while this component is mounted
  useEffect(() => {
    document.body.classList.add("dark-mode");

    // Clean up when leaving admin page
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await addDoc(collection(db, "teachers"), {
      name,
      department,
      subject,
      createdAt: new Date(),
    });

    setName("");
    setDepartment("");
    setSubject("");
    alert("Teacher added successfully");
  } catch (error) {
    console.error("Error adding teacher:", error);
    alert(error.message);
  }
};


  return (
    <div className="main-wrapper">
      <section className="main-card">
        <h1 className="main-title">Add Teacher</h1>
        <p className="main-subtitle">
          Quickly add a new teacher with their department and subject.
        </p>

        <Form className="main-form" onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicName" className="main-group">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicDepartment" className="main-group">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicSubject" className="main-group">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Form.Group>

          <div className="main-actions">
            <Button className="main-btn" type="submit">
              Upload
            </Button>
          </div>
        </Form>
      </section>
    </div>
  );
}

export default Main;
