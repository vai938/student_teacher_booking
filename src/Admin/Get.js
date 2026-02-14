import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useState, useEffect } from "react";
import EditComponent from "./EditComponent";
import DeleteComponent from "./DeleteComponent";
import "./Get.css";

function Get() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        const teachers = {};

        querySnapshot.forEach((doc) => {
          teachers[doc.id] = doc.data();
        });

        setData(teachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="get-wrapper">
      <section className="get-card">
        <h1 className="get-title">Teacher Data</h1>
        <p className="get-subtitle">
          View, update, or remove teacher records.
        </p>

        <div className="table-container">
          {Object.keys(data).length === 0 ? (
            <p className="empty-text">No teachers found.</p>
          ) : (
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Subject</th>
                  <th className="action-col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(data).map(([id, teacher]) => (
                  <tr key={id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.department}</td>
                    <td>{teacher.subject}</td>

                    <td className="actions">
                      <EditComponent
                        id={id}
                        name={teacher.name}
                        department={teacher.department}
                        subject={teacher.subject}
                      />
                      <DeleteComponent id={id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

export default Get;
