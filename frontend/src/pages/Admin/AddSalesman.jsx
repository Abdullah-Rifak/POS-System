
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Logger from "../../services/logger";
import swal from "sweetalert2"
const styles = {
  pageContainer: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  pageHeader: {
    color:" #eb8d21",
    marginBottom: "15px",
  },
  addBtn: {
    backgroundColor: "#EB8D21",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  dataTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thtd: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
  },
  th: {
    backgroundColor:"#EB8D21",
    color: "white",
  },
  actionBtn: {
    marginRight: "8px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editBtn: {
    background:" #062e60",
  color:" #fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  marginRight: "6px",
  cursor: "pointer",
  },
  deleteBtn: {
    background: "#bc1919",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "#fff",
    padding: "25px 30px",
    borderRadius: "10px",
    width: "350px",
    boxSizing: "border-box",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "12px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "15px",
  },
  saveButton: {
    background: "#eb8d21",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
  },
  cancelButton: {
    background: "#c49595",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
  },
};
export default function AddSalesman() {
  const [salesmen, setSalesmen] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    phoneNumber: "",
    salary: "",
  });
  const [editId, setEditId] = useState(null)
  useEffect(() => {
    fetchSalesmen();
  }, []);
  const fetchSalesmen = async () => {
    try {
      const response = await axiosInstance.get("/salesman/");
      setSalesmen(response.data);
    } catch (error) {
      Logger.error("Error fetching salesmen:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axiosInstance.put(`/salesman/update/${editId}`, formData);
      } else {
        await axiosInstance.post("/salesman/create", formData);
      }
      fetchSalesmen();
      setShowModal(false);
      setFormData({ userName: "", phoneNumber: "", salary: "", password: "" });
      setEditId(null);
    } catch (err) {
      Logger.error("Error saving salesman:", err);
      swal.fire({ title: "Error", text: "Failed to save salesman", icon: "error" });
    }
  };

  const handleEdit = (salesman) => {
    setEditId(salesman._id);
    setFormData({
      userName: salesman.userName,
      phoneNumber: salesman.phoneNumber,
      salary: salesman.salary,
      password: "", // you can skip password update
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    
    const result = await swal.fire({
            title: "Are you sure?",
            text: "This salesman record will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
          });
        
          if (!result.isConfirmed) return;
      try {
        await axiosInstance.delete(`/salesman/delete/${id}`);
        fetchSalesmen();
        swal.fire({
                    title:"Successful",
                    text:"salesman record deleted successfully",
                    icon:"success"
                  });
      } catch (err) {
        console.error("Error deleting salesman:", err);
        swal.fire({
                  text:"error deleing salesman record",
                  title:"Error",
                  icon:"error"
                })
      }
    
  };

  return (
   <div style={styles.pageContainer} >
      <div>
        <h2 style={styles.pageHeader}>Manage Salesmen</h2>
        <button style={styles.addBtn} onClick={() => setShowModal(true)}>Add Salesman</button>
      </div>

      <table style={styles.dataTable}>
        <thead>
          <tr>
            <th style= {{ ...styles.thtd, ...styles.th }}>#</th>
            <th style= {{ ...styles.thtd, ...styles.th }}>Salesman Name</th>
            <th style= {{ ...styles.thtd, ...styles.th }}>Phone Number</th>
            <th style= {{ ...styles.thtd, ...styles.th }}>Salary</th>
            <th style= {{ ...styles.thtd, ...styles.th }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {salesmen.length > 0 ? (
            salesmen.map((s, index) => (
              <tr key={s._id}>
                <td style={styles.thtd}>{index + 1}</td>
                <td style={styles.thtd}>{s.userName}</td>
                <td style={styles.thtd}>{s.phoneNumber || "N/A"}</td>
                <td style={styles.thtd}>{s.salary ? `$${s.salary}` : "N/A"}</td>
                <td style={styles.thtd}>
                  <button style={{ ...styles.actionBtn, ...styles.editBtn }} onClick={() => handleEdit(s)}>Edit</button>
                  <button
                    style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "12px" }}>
                No salesmen found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{editId ? "Edit Salesman" : "Add Salesman"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                style={styles.input}
                name="userName"
                placeholder="User Name"
                value={formData.userName}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                style={styles.input}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="phoneNumber"
                placeholder="Phone Number"
                style={styles.input}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                style={styles.input}
                value={formData.salary}
                onChange={handleChange}
              />
              <div style={styles.modalActions}>
                <button type="submit" style={styles.saveButton}>Save</button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  
  );
}