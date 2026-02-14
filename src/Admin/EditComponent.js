import React, { useState } from "react";
import { db } from "../Firebase";
import { doc, updateDoc } from "firebase/firestore";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./EditComponent.css";

function EditComponent({ id, name, department, subject }) {
  const [show, setShow] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedDepartment, setEditedDepartment] = useState(department);
  const [editedSubject, setEditedSubject] = useState(subject);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "teachers", id), {
        name: editedName,
        department: editedDepartment,
        subject: editedSubject,
      });

      setShow(false);
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert(error.message);
    }
  };

  return (
    <>
      {/* Edit Button */}
      <Button size="sm" onClick={() => setShow(true)}>
        Edit
      </Button>

      {/* Edit Modal / Panel */}
      {show && (
        <div className="edit-wrapper">
          <section className="edit-card">
            <h2 className="edit-title">Update Teacher</h2>

            <Form className="edit-form" onSubmit={handleSubmit}>
              <Form.Group className="edit-group">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="edit-group">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  value={editedDepartment}
                  onChange={(e) => setEditedDepartment(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="edit-group">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                />
              </Form.Group>

              <div className="edit-actions">
                <Button type="submit" className="edit-btn">
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShow(false)}
                  className="edit-btn"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </section>
        </div>
      )}
    </>
  );
}

export default EditComponent;
