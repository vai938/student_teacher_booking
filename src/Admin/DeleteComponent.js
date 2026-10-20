import React from "react";
import { db } from "../Firebase";
import { doc, deleteDoc } from "firebase/firestore";
import "./DeleteComponent.css";

function DeleteComponent({ id }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this faculty record from the directory?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "teachers", id));
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert(error.message);
    }
  };

  return (
    <button
      type="button"
      className="btn-delete-faculty"
      onClick={handleDelete}
      title="Delete faculty record"
    >
      Delete
    </button>
  );
}

export default DeleteComponent;
