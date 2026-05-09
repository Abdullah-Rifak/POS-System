import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../services/axiosInstance";
import Logger from "../../services/logger";
import "../styles/AddItem.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import swal from "sweetalert2"
import { useNavigate } from "react-router-dom";

export default function SalesmanStock() {
  const [stocks, setStocks] = useState([]);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [formData, setFormData] = useState({ itemId: "", quantity: "" });
  const [returnForm, setReturnForm] = useState({ itemId: "", returnItem: "" });
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [activeMenu, setActiveMenu] = useState("stock");
  const [borrowal,setBorrowal]=useState([]);
  const[showBorrowalModal,setShowBorrowalModal]=useState(false);
  const [borrowalData, setBorrowalData] = useState({
  borrowerName: "",
  amount: ""
});
const [editBorrowal, setEditBorrowal] = useState(null);
const [showEditBorrowalModal, setShowEditBorrowalModal] = useState(false);

const [showAdditionalModal, setShowAdditionalModal] = useState(false);
const [additional,setAdditional]=useState([]);
const [additonalData, setAdditionalData] = useState({
  reason: "",
  amount: "",
});
const[stringHoppers,setStringHoppers]=useState([]);
const[showHoppersModal,setShowHoppersModal]=useState(false);
const[hoppersData,setHoppersData]=useState({
  type:"",
  amount:""
});
const [editHoppers,setEditHoppers]=useState(null);
const [showEditHoppersModal,setShowEditHoppersModal]=useState(false);
// const [editStock,setEditStock]=useState(null);  // Unused - remove if not needed
const [isReturnAvailable,setIsReturnAvailable]=useState(false);
// const [showEditStockModal,setShowEditStockModal]=useState(false);  // Unused - remove if not needed
const [totals, setTotals] = useState({
    totalIncome: 0,
    totalSupplierPayment: 0,
    totalBorrowals: 0,
    totalExpenses: 0,
    grandTotal: 0,
  });
  const [totalsHoppers, setTotalsHoppers] = useState({
  totalIn: 0,
  totalOut: 0,
  totalReturn: 0,
  sold: 0
});
  const [stringHoppersPrice, setStringHoppersPrice] = useState(4);
const navigate=useNavigate();

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/item");
      setItems(res.data);
    } catch (error) {
      Logger.error("Error fetching items", error);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await axiosInstance.get("/stock/combined");
      setStocks(res.data);
    } catch (error) {
      Logger.error("Error fetching stocks", error);
    }
  };

  const fetchReturns = async () => {
    try {
      const res = await axiosInstance.get("/return");
      return res.data;
    } catch (error) {
      Logger.error("Error fetching returns", error);
      return [];
    }
  };
  const fetchSuppliersWithPayment =async()=>{
    try {
      const res = await axiosInstance.get("/supplier/get");
      setSuppliers(res.data.data);
    } catch (err) {
      Logger.error("Error fetching suppliers:", err);
    }
  }
  const fetchBorrowals=async()=>{
    try {
      const res=await axiosInstance.get("/borrow");
    setBorrowal(res.data);
    } catch (error) {
      Logger.error("error fetching borrowals",error)
    }
    
  }
  const fetchAdditionals=async()=>{
    try {
      const res=await axiosInstance.get("/additional")
      setAdditional(res.data)
    } catch (error) {
      Logger.error("error fetching additionals",error)
      
    }
  }
  const fetchStringHoppers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/hoppers");
      setStringHoppers(res.data);

      const totals = calculateHopperTotals(res.data);
      setTotalsHoppers(totals);
    } catch (error) {
      Logger.error("error fetching hoppers data", error);
    }
  }, []);

  const fetchStringHoppersPrice = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/hoppers/price");
      const backendPrice = Number(res?.data?.stringhoppers?.price);
      setStringHoppersPrice(Number.isFinite(backendPrice) ? backendPrice : 4);
    } catch (error) {
      Logger.error("error fetching hoppers price", error);
      setStringHoppersPrice(4);
    }
  }, []);


  useEffect(() => {
    fetchItems();
    fetchStocks();
    fetchReturns();
    fetchSuppliersWithPayment();
    fetchBorrowals();
    fetchAdditionals();
    fetchStringHoppers();
    fetchStringHoppersPrice();
  }, [fetchStringHoppers, fetchStringHoppersPrice]);
useEffect(() => {
    if (stocks.length || suppliers.length || borrowal.length || additional.length) {
      const totalIncome = stocks.reduce(
        (sum, s) => sum + (s.availableQuantity || 0) * (s.price || 0),
        0
      );

      const totalSupplierPayment = suppliers
      .filter((s) => s.paymentStatus === "Paid")
      .reduce((sum, s) => sum + (s.totalPayment || 0), 0);

      const totalBorrowals = borrowal
      .filter((b) => b.borrowalStatus === "pending")
      .reduce((sum, b) => sum + (b.amount || 0), 0);

      const totalExpenses = additional.reduce(
        (sum, a) => sum + (a.amount || 0),
        0
      );
      const totalHoppersIncome=(totalsHoppers.sold||0)*stringHoppersPrice;

      const grandTotal =
        totalIncome - (totalSupplierPayment + totalBorrowals + totalExpenses)+totalHoppersIncome;

      setTotals({
        totalIncome,
        totalSupplierPayment,
        totalBorrowals,
        totalExpenses,
        totalHoppersIncome,
        grandTotal,
      });
    }
  }, [stocks, suppliers, borrowal, additional,totalsHoppers, stringHoppersPrice]);
  const generatePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Financial Summary Report", 14, 20);
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

  // Table 1 - Overview Totals
  autoTable(doc, {
    startY: 40,
    head: [["Details", "Amount"]],
    body: [
      ["Total Income", (totals?.totalIncome ?? 0).toFixed(2)],
      ["Total String hoppers Income", (totals?.totalHoppersIncome ?? 0).toFixed(2)],
      ["Total Supplier Payment", (totals?.totalSupplierPayment ?? 0).toFixed(2)],
      ["Total Borrowals (Pending)", (totals?.totalBorrowals ?? 0).toFixed(2)],
      ["Total Additional Expenses", (totals?.totalExpenses ?? 0).toFixed(2)],
      ["Grand Total", (totals?.grandTotal ?? 0).toFixed(2)],
    ],
  });

  // Table 2 - Stocks
  doc.save(`Financial_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};

//downloading pdf of stocks
const downloadStockPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Stock Report", 14, 20);
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

  if (stocks.length === 0) {
    doc.text("No data available", 14, 50);
  } else {
    const totalProfit = stocks.reduce(
      (sum, s) => sum + (s.profit || 0),
      0
    );
    autoTable(doc, {
      startY: 40,
      head: [["Item Name", "Cost", "Price", "Quantity", "Returned", "Profit"]],
      body: stocks.map((s) => [
        s.itemName || "Unknown",
        s.cost || 0,
        s.price || 0,
        s.totalStock || 0,
        s.totalReturned > 0 ? s.totalReturned : "-",
        s.totalReturned > 0 ? s.profit : "-",
      ]),
      foot: [["", "", "", "", "Total Profit", (totalProfit ?? 0).toFixed(2)]],
    });
  }

  doc.save(`Stock_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};
const downloadStringHoppersPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("String Hoppers Report", 14, 20);
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

  if (stringHoppers.length === 0) {
    doc.text("No data available", 14, 50);
  } else {
    autoTable(doc, {
      startY: 40,
      head: [["Type", "Amount", "Lender", "Time"]],
      body: stringHoppers.map((sh) => [
        sh.type,
        sh.amount || "-",
        sh?.userId?.userName || "-",
        sh.time || "-",
      ]),

      // 👇 Add totals the same way you added Total Profit in Stock PDF
      foot: [
        ["Total IN", totalsHoppers.totalIn, "", ""],
        ["Total OUT", totalsHoppers.totalOut, "", ""],
        ["Total Return", totalsHoppers.totalReturn, "", ""],
        ["Sold", totalsHoppers.sold, "", ""],
      ],

      headStyles: { fillColor: [60, 141, 188] },
      styles: { fontSize: 10 },
    });
  }

  doc.save(`String_Hoppers_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};
   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/stock/create", formData);
      fetchStocks();
      setShowModal(false);
      setFormData({ itemId: "", quantity: "" });
      swal.fire({ title: "Success", text: "Stock created successfully", icon: "success" });
    } catch (error) {
      Logger.error("Error creating stock", error);
      swal.fire({ title: "Error", text: "Failed to create stock", icon: "error" });
    }
  };
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/return/create", returnForm);

   await fetchReturns();
    await fetchStocks();
    await fetchSuppliersWithPayment()
    
    
    setShowReturnModal(false);
    setReturnForm({ itemId: "", returnItem: "" });
    
    
  };
  const handleDeleteStock = async (stockId) => {
   const result = await swal.fire({
    title: "Are you sure?",
    text: "This stock record will be deleted permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (!result.isConfirmed) return;

  try {
    await axiosInstance.delete(`http://localhost:5000/stock/delete/${stockId}`);
    fetchStocks(); // refresh table after delete
    await fetchSuppliersWithPayment();
    swal.fire({
      title:"success!",
      text:"delete successful",
      icon:"success",
    });
  } catch (error) {
    Logger.error("Error deleting stock:", error);
    swal.fire({
      title:"Oops...",
      text:"something went wrong",
      icon:"error"
    })
  }
};
//edit button functionality for stock modal
const handleEdit = (stock) => {
  const hasReturn=stock.returnId ? true : false;
  setIsReturnAvailable(hasReturn);

  setEditItem({
    _id:stock?.returnId || "",
    itemId: stock?.itemId || "",
    itemName: stock?.itemName || " no name", 
    quantity: stock?.quantity || stock?.totalStock|| 0,
    returnItem: stock?.totalReturned|| 0,
    stockId:stock?._id,
  });
  setShowEditModal(true);
};

const handleUpdate = async () => {
  try {
    await axiosInstance.put(`http://localhost:5000/stock/update/${editItem._id}`, {
      itemId: editItem.itemId,
      quantity: editItem.quantity,
      returnItem: editItem.returnItem,
    });

    swal.fire({
      icon:"success",
      title:"item edited successfully",
      text:"edit successful",
    })
    setShowEditModal(false);
    fetchStocks(); // refresh list
    await fetchSuppliersWithPayment();
  } catch (err) {
    Logger.error("Error updating:", err);
    swal.fire({
      icon:"error",
      text:"stock not updated",
      title:"Error"
    })
  }
};
const handleUpdateStock=async()=>{
  try{
    await axiosInstance.put(`http://localhost:5000/stock/updateStock/${editItem.stockId}`,{
    itemId:editItem.itemId,
    quantity:editItem.quantity,
    
  })
  swal.fire("Updated!", "Stock updated successfully", "success");
  setShowEditModal(false);
  fetchStocks();
  fetchSuppliersWithPayment();
}catch(error){
  Logger.error("Error updating:", error);
    swal.fire({
      icon:"error",
      text:"stock not updated",
      title:"Error"
    })
  }
  
}
const handleStockAndReturn=async()=>{
  if(isReturnAvailable){
    handleUpdate()
  }
  else{
    handleUpdateStock()
  }
}
//add return button
  const handleAddReturn = (stock) => {
  setReturnForm({
    itemId: stock?.itemId || "",
    itemName: stock?.itemName  || "Unknown Item",
    returnItem: "",
  });
  setShowReturnModal(true);
};

const handleTogglePaymentStatus = async (id) => {
  try {
    const res = await axiosInstance.patch(`http://localhost:5000/supplier/${id}/toggle`);
    const updatedStatus = res.data.data.paymentStatus;

    setSuppliers((prev) =>
      prev.map((sup) =>
        sup._id === id ? { ...sup, paymentStatus: updatedStatus } : sup
      )
    );
  } catch (err) {
    Logger.error("Error toggling payment status:", err);
  }
};
//Borrowal implementations

const handleToggleBorrowerPaymentStatus = async (id) => {
  try {
    const res = await axiosInstance.patch(`http://localhost:5000/borrow/${id}/toggle`);
    const updatedStatus = res.data.data.borrowalStatus;

    setBorrowal((prev) =>
      prev.map((br) =>
        br._id === id ? { ...br, borrowalStatus: updatedStatus } : br
      )
    );
  } catch (err) {
    Logger.error("Error toggling payment status:", err);
  }
};

//delete borrowals

const handleDeleteBorrowal = async (borrowId) => {
   const result = await swal.fire({
    title: "Are you sure?",
    text: "This borrow record will be deleted permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (!result.isConfirmed) return;

  try {
    await axiosInstance.delete(`http://localhost:5000/borrow/delete/${borrowId}`);
    fetchBorrowals(); // refresh table after delete
    swal.fire({
    icon:"success",
    text:"borrowal deleted succesfully",
    title:"Successfully deleted"})
  } catch (error) {
    Logger.error("Error deleting Borrowal:", error);
    swal.fire({
    icon:"error",
    title:"Error in deleting borrowal",
    text:"something went wrong"
    })
  }
};
// edit button for borrowals
const handleEditBorrowals = (borrow) => {
  setEditBorrowal({
    _id:borrow?._id|| "",
    borrowerName: borrow?.borrowerName || " no name",
    amount: borrow?.amount || "",
    
    
  });
  setShowEditBorrowalModal(true);
};

const handleUpdateBorrowals = async () => {
  try {
    await axiosInstance.put(`http://localhost:5000/borrow/update/${editBorrowal._id}`, {
      borrowerName: editBorrowal.borrowerName,
      amount: editBorrowal.amount,
    });

    swal.fire({
      title:"updated",
      text:"borrowal updated successfully",
      icon:"success"
    })
    await fetchBorrowals();
    setShowEditBorrowalModal(false);
    
  } catch (err) {
    Logger.error("Error updating:", err);
    swal.fire({
      icon:"error",
      title:"Error",
      text:"Error updating borrowal"
    })
  }
};
const handleDeleteAdditional = async (additionalId) => {
  const result = await swal.fire({
    title: "Are you sure?",
    text: "This Additional record will be deleted permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (!result.isConfirmed) return;

  try {
    await axiosInstance.delete(`http://localhost:5000/additional/delete/${additionalId}`);
    fetchAdditionals(); // refresh table after delete
    swal.fire({
      icon:"success",
      title:"success!",
      text:"additional record delted successfully..!"
    })
  } catch (error) {
    Logger.error("Error deleting Additional:", error);
    swal.fire({
      icon:"error",
      text:"Error deleting additional record",
      title:"Error"
    })
  }
};
const totalProfit = stocks.reduce(
  (sum, stock) => sum + (stock.profit || 0),
  0
);

const handleDeleteString = async (stringId) => {
  const result = await swal.fire({
    title: "Are you sure?",
    text: "This hoppers record will be deleted permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (!result.isConfirmed) return;

  try {
    await axiosInstance.delete(`http://localhost:5000/hoppers/delete/${stringId}`);
    fetchStringHoppers(); // refresh table after delete
    swal.fire({
      title:"Successful",
      text:"hoppers record deleted successfully",
      icon:"success"
    });
  } catch (error) {
    Logger.error("Error deleting String hopers:", error);
    swal.fire({
      text:"error deleing hoppers record",
      title:"Error",
      icon:"error"
    })
  }
};
const handleEditString = (string) => {
  setEditHoppers({
    _id:string?._id|| "",
    type: string?.type || " no type",
    amount: string?.amount || "",
  });
  setShowEditHoppersModal(true);
};

const handleUpdateString = async () => {
  try {
    await axiosInstance.put(`http://localhost:5000/hoppers/update/${editHoppers._id}`, {
      type: editHoppers.type,
      amount: editHoppers.amount,
    });

    swal.fire({
      title:"Successful",
      text:"hoppers record updated successfully",
      icon:"success"
    });
    await fetchStringHoppers();
    setShowEditHoppersModal(false);
    
  } catch (err) {
    Logger.error("Error updating:", err);
    swal.fire({
      text:"error updating hoppers record",
      title:"Error",
      icon:"error"
    })
  }
};
const calculateHopperTotals=(entries)=>{
  const todayDate=new Date().toISOString().split("T")[0];

  const todaysEntries=entries.filter(e=>{
    const entryDate=new Date(e.date).toISOString().split("T")[0];
    return entryDate===todayDate;
  })
  const totalIn=todaysEntries.filter(e=>e.type==="IN").reduce((sum,e)=>sum+e.amount,0);
  const totalOut = todaysEntries
    .filter(e => e.type === "OUT")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalReturn = todaysEntries
    .filter(e => e.type === "RETURN")
    .reduce((sum, e) => sum + e.amount, 0);

  const sold = totalIn - (totalOut + totalReturn);

  return { totalIn, totalOut, totalReturn, sold };
}

const handleLogout = async () => {
  const result = await swal.fire({
    title: "Are you sure?",
    text: "you will be logged out from the system.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, log out",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (!result.isConfirmed) return;
  try {
    await axiosInstance.post("/auth/logout", {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  } catch (err) {
    Logger.error("Logout error:", err);
  }

  // Clear token and user data
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  navigate("/login");
};
  return (
    
<div className="page-container">

      {/* Sidebar */}
  <div className="sidebar">
    <h2>Menu</h2>
    <ul>
      <li>
        <button
          className={activeMenu === "stock" ? "active" : ""}
          onClick={() => setActiveMenu("stock")}
        >
          Stock Management
        </button>
      </li>
      <li>
        <button
          className={activeMenu === "supplier" ? "active" : ""}
          onClick={() => setActiveMenu("supplier")}
        >
          Supplier Payment
        </button>
      </li>
      <li>
        <button
          className={activeMenu === "borrow" ? "active" : ""}
          onClick={() => setActiveMenu("borrow")}
        >
          Money Borrowal
        </button>
      </li>
      <li>
        <button
          className={activeMenu === "additional" ? "active" : ""}
          onClick={() => setActiveMenu("additional")}
        >
          Additional Expences
        </button>
      </li>
      <li>
        <button 
        className={activeMenu==="string" ? "active":""}
        onClick={()=>setActiveMenu("string")}
        >
          String Hoppers
        </button>
      </li>
      <li>
        <button
          className={activeMenu === "summary" ? "active" : ""}
          onClick={() => setActiveMenu("summary")}
        >
          Summary
        </button>
      </li>
      <li>
        <button className={activeMenu==="logout" ? "active":""}
        onClick={handleLogout}>
          Logout
        </button>
      </li>
    </ul>
  </div>
<div className="contain_for_tables">
      <h2 className="header">
        {activeMenu === "stock"
          ? "Salesman Stock Management"
          : activeMenu === "supplier"
          ? "Supplier Payment"
          : activeMenu==="borrow"
          ? "Money Borrowal"
          : activeMenu==="additional"
          ? "Additional Expences"
          : activeMenu==="string"
          ? "String Hoppers"
          : "Summary"}
          </h2>

          {/* Buttons in the relevant tables */}
          {activeMenu === "stock" && (
            <div>
        <button className="addButton" onClick={() => setShowModal(true)}>
          + Add Stock
        </button>
          <div className="table-actions">
            <button className="btn downloadBtn" onClick={downloadStockPDF}>
              Download PDF
            </button>
            
          </div>

        </div>
      )}
      {activeMenu==="borrow" && (
        <button className="addButton" onClick={()=>setShowBorrowalModal(true)}>
          + Add Borrowal
        </button>
      )}
      {activeMenu==="additional" && (
        <button className="addButton" onClick={()=>setShowAdditionalModal(true)}>
          + Add Additional
        </button>
      )}
      {activeMenu==="string" && (
        <div>
        <button className="addButton" onClick={()=>setShowHoppersModal(true)}>
          + Add String Hoppers
        </button>
        <div className="table-actions">
            <button className="btn downloadBtn" onClick={downloadStringHoppersPDF}>
              Download PDF
            </button>
            
          </div>
        </div>
      )}
      {activeMenu==="summary" && (
        <div className="table-actions">
        <button className="btn downloadBtn" onClick={generatePDF}>
          Download PDF
        </button>
        </div>
      )}
      
       { activeMenu === "stock" && (
      
      <table className="table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Cost</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Returned</th>
            <th>Profit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
  <tr key={stock._id} className={stock.totalReturned > 0 ? "" : "no-return"}>
    <td>{stock.itemName || "Unknown"}</td>
    <td>{stock?.cost || 0}</td>  
    <td>{stock?.price || 0}</td>      
    <td>{stock?.totalStock || 0}</td>        
    <td>{stock.totalReturned > 0 ? stock.totalReturned : "-"}</td>     
    <td>{stock.totalReturned > 0 ? stock.profit : "-"}</td>
    <td>
  <button
  className="addBtn"
  onClick={() =>
    handleAddReturn(stock)}
    disabled={stock.totalReturned > 0}
>
  {stock.totalReturned > 0 ? "Added" : "Add Return"}
</button>
<button
className="editBtn"
onClick={()=>handleEdit(stock)}>Edit</button>
  <button
    className="deleteBtn"
    onClick={() => handleDeleteStock(stock._id)}
  >
    Delete
  </button>
</td>
  </tr>
))}
        </tbody>
        <tfoot>
    <tr>
      <td colSpan={5} style={{ textAlign: "right", fontWeight: "bold" }}>
        Total Profit
      </td>
      <td style={{ fontWeight: "bold" }}>{(totalProfit ?? 0).toFixed(2)}</td>
      <td></td>
    </tr>
  </tfoot>
      </table>
)}
      
      {activeMenu === "supplier" && (
      <table className="table">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Phone Number</th>
            <th>Total Payment</th>
            <th>payment status</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length > 0 ? (
          suppliers.map((sup) => (
            <tr key={sup._id}
            style={{
            backgroundColor: sup.paymentStatus === "Paid" ? "#d0f5d0" : "#f8d0d0",
            transition: "background-color 0.3s",
          }}>
              <td>{sup.fullName}</td>
              <td>{sup.phoneNumber || "-"}</td>
              <td>{(sup?.totalPayment ?? 0).toFixed(2)}</td>
              <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={sup.paymentStatus === "Paid"}
                      onChange={() => handleTogglePaymentStatus(sup._id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" style={{ textAlign: "center", color: "gray" }}>
              No suppliers found
            </td>
          </tr>
        )}
      </tbody>
      </table>
      )}

      {activeMenu === "borrow" && (
  <div>
    <table className="table">
      <thead>
        <tr>
          <th>Borrower Name</th>
          <th>Amount</th>
          <th>Lender</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {borrowal.length > 0 ? (
          borrowal.map((br) => (
            <tr key={br._id}
            style={{
            backgroundColor: br.borrowalStatus === "returned" ? "#d0f5d0" : "#f8d0d0",
            transition: "background-color 0.3s",
          }}>
              <td>{br.borrowerName}</td>
              <td>{br.amount || "-"}</td>
              <td>{br?.userId?.userName || "-"}</td>
              <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={br.borrowalStatus === "returned"}
                       onChange={() => handleToggleBorrowerPaymentStatus(br._id)}
                    />
                    <span className="slider"></span>
                  </label>
              </td>
              <td>
                <button className="editBtn" onClick={()=>handleEditBorrowals(br)}>Edit</button>
                <button className="deleteBtn" onClick={()=>handleDeleteBorrowal(br._id)}>Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", color: "gray" }}>
              No borrowals found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}


{/* additional expences table */}
{activeMenu === "additional" && (
  <div>
    <table className="table">
      <thead>
        <tr>
          <th>Reason</th>
          <th>Amount</th>
          <th>Lender</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {additional.length > 0 ? (
          additional.map((ad) => (
            <tr key={ad._id}
            style={{
            backgroundColor:"#d0f5d0",
            transition: "background-color 0.3s",
          }}>
              <td>{ad.reason}</td>
              <td>{ad.amount || "-"}</td>
              <td>{ad?.userId?.userName || "-"}</td>
              <td>
                <button className="deleteBtn" onClick={()=>handleDeleteAdditional(ad._id)}>Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", color: "gray" }}>
              No Additionals found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}
{/* String hoppers table */}

{activeMenu === "string" && (
  <div>
    <table className="table">
      <thead>
        <tr>
          <th>type</th>
          <th>Amount</th>
          <th>Lender</th>
          <th>Time</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {stringHoppers.length > 0 ? (
          stringHoppers.map((sh) => (
            <tr key={sh._id}
            style={{
            backgroundColor:"#d0f5d0",
            transition: "background-color 0.3s",
          }}>
              <td>{sh.type}</td>
              <td>{sh.amount || "-"}</td>
              <td>{sh?.userId?.userName || "-"}</td>
              <td>{sh.time|| "-"}</td>
              <td>
                <button className="editBtn" onClick={()=>handleEditString(sh)}>Edit</button>
                <button className="deleteBtn" onClick={()=>handleDeleteString(sh._id)}>Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" style={{ textAlign: "center", color: "gray" }}>
              No string hoppers found
            </td>
          </tr>
        )}
      </tbody>
      <tfoot>
    <tr style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
      <td colSpan="5" style={{ padding: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total IN: {totalsHoppers.totalIn}</span>
          <span>Total OUT: {totalsHoppers.totalOut}</span>
          <span>Total Return: {totalsHoppers.totalReturn}</span>
          <span>Sold: {totalsHoppers.sold}</span>
        </div>
      </td>
    </tr>
  </tfoot>
    </table>
    {/* <div style={{ marginTop: "20px", fontWeight: "bold", fontSize: "18px" }}>
  <p>Total IN: {totalsHoppers.totalIn}</p>
  <p>Total OUT: {totalsHoppers.totalOut}</p>
  <p>Total Return: {totalsHoppers.totalReturn}</p>
  <p>Sold: {totalsHoppers.sold}</p>
</div> */}
  </div>
)}

{/* summary table */}

{activeMenu === "summary" && (
  <div>
    
    <table className="table">
      <thead>
        <tr>
          <th>Details</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total income</td>
          <td>{(totals?.totalIncome ?? 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td>Total String Hoppers Income</td>
          <td>{(totals?.totalHoppersIncome ?? 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td>Total Supplier Payment</td>
          <td>{(totals?.totalSupplierPayment ?? 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td>Total Borrowals</td>
          <td>{(totals?.totalBorrowals ?? 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td>Total Additional expences</td>
          <td>{(totals?.totalExpenses ?? 0).toFixed(2)}</td>
        </tr>
        <tr>
          <td><strong>Grand Total</strong></td>
          <td><strong>{(totals?.grandTotal ?? 0).toFixed(2)}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
)}
      {/* Add Stock Modal */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>Add Stock</h3>
            <form onSubmit={handleSubmit}>
              <select
                className="input"
                value={formData.itemId}
                onChange={(e) =>
                  setFormData({ ...formData, itemId: e.target.value })
                }
                required
              >
                <option value="">Select Item</option>
                {items.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.itemName}
                  </option>
                ))}
              </select>

              <input
                className="input"
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />

              <div className="modalActions">
                <button type="submit" className="saveBtn">
                  Add
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

      {/* Add Return Modal */}
      {showReturnModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>Add Return</h3>
            <form onSubmit={handleReturnSubmit}>
              <input
                className="input"
                 value={returnForm.itemName}
                readOnly
              />

        <input
          className="input"
          type="number"
          placeholder="Return Quantity"
          value={returnForm.returnItem}
          onChange={(e) =>
            setReturnForm({ ...returnForm, returnItem: e.target.value })
          }
          required
        />

        <div className="modalActions">
          <button type="submit" className="saveBtn">Add Return</button>
          <button
            type="button"
            className="cancelBtn"
            onClick={() => setShowReturnModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/*edit modal appearance */}
{/* {showEditModal && (
  <div className="modalOverlay">
    <div className="modal">
      <h3>Edit Stock</h3>

      <label>Item Name:</label>
      <input
        type="text"
        value={editItem.itemName || "Unknown Item"}
        readOnly
        className="input"
      />

      <label>Quantity:</label>
      <input
        className="input"
        type="number"
        value={editItem.quantity}
        onChange={(e) =>
          setEditItem({ ...editItem, quantity: Number(e.target.value) })
        }
      />

      <label>Return:</label>
      <input
        className="input"
        type="number"
        value={editItem.returnItem}
        onChange={(e) =>
          setEditItem({ ...editItem, returnItem: Number(e.target.value) })
        }
      />

      <div className="modalActions">
        <button
        className="saveBtn"
        onClick={async () => {
          // Only validate fields the user can actually edit
          if (editItem.quantity <= 0) {
            swal.fire({
              title:"warning",
              icon:"warning",
              text:"Enter a positive number"
            })
            return;
          }

        try {
          await handleUpdate(); // sends _id, quantity, returnItem to backend
          swal.fire({
            icon:"success",
            text:"return and stock updated successfully",
            title:"Success!"
          })
          setShowEditModal(false);
          setEditItem({
            _id: "",
            itemId: "",
            itemName: "",
            quantity: "",
            returnItem: "",
          });
        } catch (err) {
          Logger.error("Error updating:", err);
          swal.fire({
            icon:"error",
            title:"Error",
            text:"error updating stck and return"
          })
        }
  }}
        >
          Update
        </button>

        <button
          className="cancelBtn"
          onClick={() => setShowEditModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)} */}
{/* money borrowal modal */}
{showBorrowalModal && (
  <div className="modalOverlay">
    <div className="modal">
      <h3>Add Borrowal</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await axiosInstance.post(
              "/borrow/create",
              { ...borrowalData },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            swal.fire({
              title:"successful",
              text:"borrowal added successfully..!",
              icon:"success"
            })
            setBorrowalData({ borrowerName: "", amount: ""});
            setShowBorrowalModal(false);
            await fetchBorrowals();
          } catch (err) {
            Logger.error("Error adding borrowal", err);
            swal.fire({
              icon:"error",
              text:"Error adding borrowal entry",
              title:"Error"
            })
          }
        }}
      >
        <input
          className="input"
          type="text"
          placeholder="Borrower Name"
          value={borrowalData.borrowerName}
          onChange={(e) =>
            setBorrowalData({ ...borrowalData, borrowerName: e.target.value })
          }
          required
        />

        <input
          className="input"
          type="number"
          placeholder="Amount"
          value={borrowalData.amount}
          onChange={(e) =>
            setBorrowalData({ ...borrowalData, amount: e.target.value })
          }
          required
        />

        <div className="modalActions">
          <button type="submit" className="saveBtn">
            Add
          </button>
          <button
            type="button"
            className="cancelBtn"
            onClick={() => setShowBorrowalModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{/* edit borrowal modal */}
{showEditBorrowalModal && (
  <div className="modalOverlay">
    <div className="modal">
      <h3>Edit Borrowal</h3>

      <label>Borrower Name:</label>
      <input
        type="text"
        value={editBorrowal.borrowerName || "Unknown Borrower"}
        readOnly
        className="input"
      />

      <label>Amount:</label>
      <input
        className="input"
        type="number"
        value={editBorrowal.amount}
        onChange={(e) =>
          setEditBorrowal({ ...editBorrowal, amount: Number(e.target.value) })
        }
      />

      <div className="modalActions">
        <button
        className="saveBtn"
        onClick={async () => {
          // Only validate fields the user can actually edit
          if (editBorrowal.amount <= 0) {
           swal.fire({
            icon:"warning",
            title:"psoitive number",
            text:"enter a positive number",
           })
            return;
          }

        try {
          await handleUpdateBorrowals(); 
          swal.fire({
            icon:"success",
            text:"borrowal updated successfully",
            title:"Successful"
          })
          setShowEditBorrowalModal(false);
          setEditBorrowal({
            _id: "",
            borrowerName: "",
            amount: ""
           
          });
        } catch (err) {
          Logger.error("Error updating:", err);
          swal.fire({
            icon:"error",
            title:"Error",
            text:"Error updating borrowals"
          })
        }
  }}
        >
          Update
        </button>

        <button
          className="cancelBtn"
          onClick={() => setShowEditBorrowalModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* additional expences modal */}

{showAdditionalModal && (
  <div className="modalOverlay">
    <div className="modal">
      <h3>Add Additional</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await axiosInstance.post(
              "/additional/create",
              { ...additonalData },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            
            setAdditionalData({ reason: "", amount: "" });
            setShowAdditionalModal(false);
            await fetchAdditionals();
          } catch (err) {
            Logger.error("Error adding Additionals", err);
            
          }
        }}
      >
        <input
          className="input"
          type="text"
          placeholder="reason"
          value={additonalData.reason}
          onChange={(e) =>
            setAdditionalData({ ...additonalData, reason: e.target.value })
          }
          required
        />

        <input
          className="input"
          type="number"
          placeholder="Amount"
          value={additonalData.amount}
          onChange={(e) =>
            setAdditionalData({ ...additonalData, amount: e.target.value })
          }
          required
        />
        <div className="modalActions">
          <button type="submit" className="saveBtn">
            Add
          </button>
          <button
            type="button"
            className="cancelBtn"
            onClick={() => setShowAdditionalModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


{/* String hoppers modal */}


{showHoppersModal && (
  <div className="modalOverlay">
    <div className="modal">
      <h3>Add String Hoppers</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await axiosInstance.post(
              "/hoppers/create",
              { ...hoppersData },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
           swal.fire({
            icon:"success",
            text:"hoppers entry succesfully added",
            title:"Succcesssfull!"
           })
            setHoppersData({ type: "", amount: "" });
            setShowHoppersModal(false);
            await fetchStringHoppers();
          } catch (err) {
            Logger.error("Error adding String Hoppers", err);
            swal.fire({
              icon:"error",
              text:"error in adding hoppers entry",
              title:"Oops...!"
            })
          }
        }}
      >
        <select 
          className="input"
          value={hoppersData.type}
          onChange={(e) =>
            setHoppersData({ ...hoppersData, type: e.target.value })
          }
          required
        >
        <option value=" ">Select type</option>
        <option value="IN">In</option>
        <option value="OUT">Out</option>
        <option value="RETURN">return</option>
        </select>

        <input
          className="input"
          type="number"
          placeholder="Amount"
          value={hoppersData.amount}
          onChange={(e) =>
            setHoppersData({ ...hoppersData, amount: e.target.value })
          }
          required
        />
        <div className="modalActions">
          <button type="submit" className="saveBtn">
            Add
          </button>
          <button
            type="button"
            className="cancelBtn"
            onClick={() => setShowHoppersModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{/* string Hoppers edit modal */}
{showEditHoppersModal && (
  <div className="modalOverlay">
    <div className="modal">
      <h3>Edit String Hoppers</h3>

      <label>Type:</label>
      <input
        type="text"
        value={editHoppers.type || "-"}
        readOnly
        className="input"
      />

      <label>Amount:</label>
      <input
        className="input"
        type="number"
        value={editHoppers.amount}
        onChange={(e) =>
          setEditHoppers({ ...editHoppers, amount: Number(e.target.value) })
        }
      />

      <div className="modalActions">
        <button
        className="saveBtn"
        onClick={async () => {
          
          if (editHoppers.amount <= 0) {
           swal.fire({
            icon:"warning",
            title:"Warning",
            text:"enter a positive number"
           })
            return;
          }

        try {
          await handleUpdateString(); 
          
          setShowEditHoppersModal(false);
          setEditHoppers({
            _id: "",
            type: "",
            amount: ""
           
          });
        } catch (err) {
          Logger.error("Error updating:", err);
          swal.fire({
            icon:"error",
            text:"error in updating hoppers entry",
            title:"Error"
          })
        }
  }}
        >
          Update
        </button>

        <button
          className="cancelBtn"
          onClick={() => setShowEditHoppersModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showEditModal && (
  <div className="modalOverlay">
    <div className="modal">

      <h3>Edit {editItem.itemName}</h3>

      {/* Stock Quantity */}
      <label>Quantity</label>
      <input
        type="number"
        value={editItem.quantity}
        onChange={(e) =>
          setEditItem({ ...editItem, quantity: e.target.value })
        }
      />

      {/* Return Field – only if return exists */}
      {isReturnAvailable && (
        <>
          <label>Return Amount</label>
          <input
            type="number"
            value={editItem.returnItem}
            onChange={(e) =>
              setEditItem({ ...editItem, returnItem: e.target.value })
            }
          />
        </>
      )}
      <div className="modalActions">

      <button onClick={handleStockAndReturn} className="saveBtn">
        Update
      </button>

      <button onClick={() => setShowEditModal(false)} className="cancelBtn">
        Cancel
      </button>
      </div>

    </div>
  </div>
)}
</div>
    </div>
  );
}





