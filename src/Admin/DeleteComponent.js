import React from "react";
import { db } from "../Firebase";
import { doc, deleteDoc } from "firebase/firestore";
import "./DeleteComponent.css";
import Button from "react-bootstrap/Button";

function DeleteComponent({ id }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
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
    <Button
  size="sm"
  variant="danger"
  onClick={handleDelete}
>
  Delete
</Button>
  );
}

export default DeleteComponent;
