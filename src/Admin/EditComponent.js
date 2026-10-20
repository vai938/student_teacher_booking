import React, { useState } from "react";
import { db } from "../Firebase";
import { doc, updateDoc } from "firebase/firestore";
import "./EditComponent.css";

function EditComponent({ id, name, department, subject }) {
  const [show, setShow] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedDepartment, setEditedDepartment] = useState(department);
  const [editedSubject, setEditedSubject] = useState(subject);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateDoc(doc(db, "teachers", id), {
        name: editedName.trim(),
        department: editedDepartment.trim(),
        subject: editedSubject.trim(),
      });
      setShow(false);
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn-edit-trigger"
        onClick={() => setShow(true)}
      >
        Edit
      </button>

      {show && (
        <div className="modal-backdrop-overlay" onClick={() => setShow(false)}>
          <div
            className="modal-dialog-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-card-header">
              <h3 className="modal-card-title">Update Faculty Record</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShow(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-edit-form">
              <div className="form-field">
                <label htmlFor={`edit-name-${id}`}>Faculty Name *</label>
                <input
                  id={`edit-name-${id}`}
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`edit-dept-${id}`}>Department *</label>
                <input
                  id={`edit-dept-${id}`}
                  type="text"
                  value={editedDepartment}
                  onChange={(e) => setEditedDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`edit-subj-${id}`}>Course / Subject *</label>
                <input
                  id={`edit-subj-${id}`}
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-save"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default EditComponent;
