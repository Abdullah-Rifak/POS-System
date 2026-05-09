import React,{ useState, useEffect } from "react"
import axiosInstance from "../../services/axiosInstance"
import Logger from "../../services/logger"
import swal from "sweetalert2"

export default function AddSupplier(){
    const [suppliers, setSuppliers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [editId, setEditId] = useState(null);
  useEffect(() => {
    fetchSuppliers();
  }, []);
    const fetchSuppliers = async () => {
      try {
        const res = await axiosInstance.get("/supplier");
        setSuppliers(res.data);
      } catch (error) {
        Logger.error("Error fetching suppliers:", error);
      }
    };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        
        await axiosInstance.put(`/supplier/update/${editId}`, formData);
      } else {
        
        await axiosInstance.post("/supplier/create", formData);
      }
      fetchSuppliers();
      setShowModal(false);
      setFormData({ fullName: "", phoneNumber: "" });
      setEditId(null);
    } catch (error) {
      Logger.error("Error saving supplier:", error);
      swal.fire({ title: "Error", text: "Failed to save supplier", icon: "error" });
    }
  };
  const handleEdit = (supplier) => {
    setEditId(supplier._id);
    setFormData({
      fullName: supplier.fullName,
      phoneNumber: supplier.phoneNumber,
    });
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    const result = await swal.fire({
            title: "Are you sure?",
            text: "This supplier record will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
          });
        
          if (!result.isConfirmed) return; 
      try {
        await axiosInstance.delete(`/supplier/delete/${id}`);
        fetchSuppliers();
        swal.fire({
                    title:"Successful",
                    text:"supplier record deleted successfully",
                    icon:"success"
                  });
      } catch (error) {
        console.error("Error deleting supplier:", error);
      }
    
  };
    return(
        <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Suppliers</h1>
        <button style={styles.addButton} onClick={() => setShowModal(true)}>
          + Add Supplier
        </button>
      </div>

     
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Phone Number</th>
            <th style={styles.th}>Total Payment</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length > 0 ? (
            suppliers.map((s, index) => (
              <tr key={s._id} style={styles.tr}>
                <td style={styles.tdCenter}>{index + 1}</td>
                <td style={styles.td}>{s.fullName}</td>
                <td style={styles.td}>{s.phoneNumber}</td>
                <td style={styles.td}>{s.totalPayment ? s.totalPayment : "-"}</td>
                <td style={styles.tdActions}>
                  <button
                    onClick={() => handleEdit(s)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No suppliers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={{ marginBottom: "15px" }}>
              {editId ? "Edit Supplier" : "Add Supplier"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.modalButtons}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                    setFormData({ fullName: "", phoneNumber: "" });
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveButton}>
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
    
}
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#FFFFFF",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  pageTitle: {
    color:"#eb8d21",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#EB8D21",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  thead: {
    backgroundColor: "#C49595",
    color: "#fff",
  },
  th: {
    padding: "12px",
    textAlign: "left",
  },
  tr: {
    borderBottom: "1px solid #ddd",
    verticalAlign: "middle",
  },
  td: {
    padding: "12px",
    textAlign: "left",
  },
  tdCenter: {
    padding: "12px",
    textAlign: "center",
  },
  tdActions: {
    padding: "10px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  editButton: {
    backgroundColor: "#EB8D21",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#C49595",
    color: "white",
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
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  formGroup: {
    marginBottom: "12px",
  },
  label: {
    display: "block",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "15px",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#EB8D21",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};