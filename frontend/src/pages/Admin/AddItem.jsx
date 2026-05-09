import React,{useState,useEffect} from "react";
import axiosInstance from "../../services/axiosInstance";
import Logger from "../../services/logger";
import "../styles/AddItem.css"
import swal from "sweetalert2"


export default function AddItem(){
    const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    cost: "",
    price: "",
    supplierId: "",
  });
  const [editId, setEditId] = useState(null);

  //fetching items to display in table
  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/item");
      setItems(res.data);
    } catch (error) {
      Logger.error("Error fetching items", error);
    }
  };

//fetching suppliers for drop down
  const fetchSuppliers = async () => {
    try {
      const res = await axiosInstance.get("/supplier");
      setSuppliers(res.data);
    } catch (error) {
      Logger.error("Error fetching suppliers", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSuppliers();
  }, []);


//form submission either modal for editing or adding 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axiosInstance.put(`/item/update/${editId}`, formData);
      } else {
        await axiosInstance.post("/item/create", formData);
      }
      fetchItems();
      setShowModal(false);
      setFormData({ itemName: "", cost: "", price: "", supplierId: "" });
      setEditId(null);
    } catch (error) {
      Logger.error("Error saving item:", error);
      swal.fire({ title: "Error", text: "Failed to save item", icon: "error" });
    }
  };


//edit button implementation
  const handleEdit = (item) => {
    setFormData({
      itemName: item.itemName,
      cost: item.cost,
      price: item.price,
      supplierId: item.supplierId?._id || "",
    });
    setEditId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await swal.fire({
        title: "Are you sure?",
        text: "This items record will be deleted permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
    
      if (!result.isConfirmed) return;
      try {
      await axiosInstance.delete(`/item/delete/${id}`);
      fetchItems();
      swal.fire({
            title:"Successful",
            text:"item record deleted successfully",
            icon:"success"
          });
    }catch (error) {
        Logger.error("Error deleting items:", error);
        swal.fire({
          text:"error deleing items record",
          title:"Error",
          icon:"error"
        })
      }
  };
    return(
      <div className="container">
      <h2 className="header">Manage Items</h2>
      <button className="addButton" onClick={() => setShowModal(true)}>
        + Add Item
      </button>

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Cost</th>
            <th>Price</th>
            <th>Supplier Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.cost}</td>
              <td>{item.price}</td>
              <td>{item.supplierId?.fullName || "Unknown"}</td>
              <td>
                <button className="editBtn" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button
                  className="deleteBtn"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>{editId ? "Update Item" : "Add Item"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                className="input"
                placeholder="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={(e) =>
                  setFormData({ ...formData, itemName: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />

              <select
                className="input"
                value={formData.supplierId}
                onChange={(e) =>
                  setFormData({ ...formData, supplierId: e.target.value })
                }
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.fullName}
                  </option>
                ))}
              </select>

              <div className="modalActions">
                <button type="submit" className="saveBtn">
                  {editId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="cancelBtn"
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