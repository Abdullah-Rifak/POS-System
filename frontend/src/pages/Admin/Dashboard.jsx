import React from "react";
import {Link,Outlet,useLocation} from "react-router-dom"
import "../styles/AdminCSS.css"
import { useCallback, useEffect,useState } from "react";
import axiosInstance from "../../services/axiosInstance"
import Logger from "../../services/logger"
import { useNavigate} from "react-router-dom";
import swal from "sweetalert2"  

// Module-level stable quotes array to avoid useEffect dependency issues
const DEFAULT_QUOTES = [
  "Take a breath — you're doing great.",
  "Small progress is still progress.",
  "Focus on the step in front of you, not the whole staircase.",
  "Your work makes a difference.",
  "A calm mind brings clear decisions."
];

export default function AdminDashboard(){
   const location = useLocation();
   const navigate =useNavigate();


  const menuItems = [
    { name: "Manage Suppliers", path: "suppliers" },
    { name: "Manage Items", path: "items" },
    { name: "Manage Salesmen", path: "salesmen" },
  ];
  const [quote, setQuote] = useState("");
  const [hoppersPrice, setHoppersPrice] = useState(4);
  const [savingHoppersPrice, setSavingHoppersPrice] = useState(false);

  const fetchHoppersPrice = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/hoppers/price");
      const backendPrice = Number(res?.data?.stringhoppers?.price);
      setHoppersPrice(Number.isFinite(backendPrice) ? backendPrice : 4);
    } catch (error) {
      Logger.error("Error fetching hoppers price", error);
    }
  }, []);

  // Pick a new soothing quote
  useEffect(() => {
    setQuote(DEFAULT_QUOTES[Math.floor(Math.random() * DEFAULT_QUOTES.length)]);
    fetchHoppersPrice();
  }, [fetchHoppersPrice]);

  // Dynamic greeting (Morning / Afternoon / Evening)
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning 🌄"
      : hour < 18
      ? "Good Afternoon ☀️"
      : "Good Evening 🌙";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const handleLogout = async () => {
  try {
    const result = await swal.fire({
        title: "Are you sure?",
        text: "You will be logged out from the system.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, logout",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
    
      if (!result.isConfirmed) return;
    await axiosInstance.post("/auth/logout", {});
  } catch (err) {
    Logger.error("Logout error:", err);
  }

  // Clear token and user data
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  navigate("/login");
};

const handleHoppersPriceSave = async () => {
  try {
    setSavingHoppersPrice(true);
    await axiosInstance.put("/hoppers/price", { price: Number(hoppersPrice) });
    swal.fire({
      title: "Updated",
      text: "String hoppers price updated successfully",
      icon: "success",
    });
  } catch (error) {
    Logger.error("Error updating hoppers price", error);
    swal.fire({
      title: "Error",
      text: "Failed to update string hoppers price",
      icon: "error",
    });
  } finally {
    setSavingHoppersPrice(false);
  }
};

const handlePriceInputChange = (value) => {
  const parsedValue = Number(value);
  if (value === "") {
    setHoppersPrice(0);
    return;
  }
  if (!Number.isFinite(parsedValue)) return;
  setHoppersPrice(parsedValue < 0 ? 0 : parsedValue);
};

const changePriceByStep = (delta) => {
  const nextPrice = Number((Number(hoppersPrice) + delta).toFixed(2));
  setHoppersPrice(nextPrice < 0 ? 0 : nextPrice);
};

     return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <ul style={styles.menu}>
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  style={{
                    ...styles.link,
                    backgroundColor: isActive ? "#000" : "transparent",
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.backgroundColor = "#b0b0b0"; // ash on hover
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.backgroundColor = "transparent";
                  }}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <button
  
  onClick={handleLogout}
  className="logoutBtn"
>
  Logout
</button>
      </aside>

      <main style={styles.main}>

  {location.pathname === "/admin/dashboard" || location.pathname === "/admin/" ? (
  <div style={styles.relaxContainer}>
      <div style={styles.floatBg}></div>

      <h1 style={styles.greetingText}>{greeting}</h1>
      <p style={styles.dateText}>{today}</p>

      <div style={styles.quoteBox}>
        <p style={styles.quoteText}>{quote}</p>
      </div>

      <button
        style={styles.refreshBtn}
        onClick={() =>
          setQuote(DEFAULT_QUOTES[Math.floor(Math.random() * DEFAULT_QUOTES.length)])
        }
      >
        Refresh Quote 🔄
      </button>

      <div style={styles.sliderCard}>
        <h3 style={styles.sliderTitle}>String Hoppers Price</h3>
        <p style={styles.sliderValue}>Current: Rs. {Number(hoppersPrice).toFixed(2)}</p>
        <div style={styles.priceEditorRow}>
          <button
            type="button"
            style={styles.stepButton}
            onClick={() => changePriceByStep(-0.25)}
            disabled={savingHoppersPrice}
          >
            -
          </button>
          <div style={styles.inputWrapper}>
            <span style={styles.currencyPrefix}>Rs.</span>
            <input
              type="number"
              min="0"
              step="0.25"
              value={hoppersPrice}
              onChange={(e) => handlePriceInputChange(e.target.value)}
              style={styles.priceInput}
              disabled={savingHoppersPrice}
            />
          </div>
          <button
            type="button"
            style={styles.stepButton}
            onClick={() => changePriceByStep(0.25)}
            disabled={savingHoppersPrice}
          >
            +
          </button>
        </div>
        <button
          style={styles.savePriceBtn}
          onClick={handleHoppersPriceSave}
          disabled={savingHoppersPrice}
        >
          {savingHoppersPrice ? "Saving..." : "Save Price"}
        </button>
      </div>
    </div>
) : null}

  <Outlet />
</main>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Poppins, sans-serif",
    backgroundColor: "#FFFFFF",
  },
  sidebar: {
    width: "240px",
    background: "#EB8D21", // Primary color
    color: "#fff",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "1.4rem",
    marginBottom: "30px",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    paddingBottom: "10px",
    textAlign: "center",
    fontWeight: "600",
  },
  menu: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    display: "block",
    padding: "12px 16px",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    backgroundColor: "transparent",
  },
  main: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: "30px",
  },
  header: {
    backgroundColor: "#C49595", // Secondary color
    padding: "15px 25px",
    borderRadius: "10px",
    color: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  content: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    minHeight: "70vh",
  },
  relaxContainer: {
    padding: "40px",
    position: "relative",
    overflow: "hidden",
  },
  floatBg: {
    position: "absolute",
    top: "-50px",
    left: "-50px",
    width: "200%",
    height: "200%",
    background:
      "linear-gradient(135deg, #c49595 0%, #eb8d21 50%, #fff 100%)",
    opacity: 0.15,
    animation: "float 10s infinite alternate",
    zIndex: -1,
  },
  greetingText: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "10px",
  },
  dateText: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "25px",
  },
  quoteBox: {
    background: "white",
    padding: "25px 30px",
    borderRadius: "12px",
    width: "fit-content",
    maxWidth: "600px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  quoteText: {
    fontSize: "20px",
    fontStyle: "italic",
    color: "#444",
  },
  refreshBtn: {
    background: "#eb8d21",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  sliderCard: {
    background: "white",
    padding: "20px 25px",
    borderRadius: "12px",
    width: "fit-content",
    minWidth: "320px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginTop: "18px",
  },
  sliderTitle: {
    margin: "0 0 8px 0",
    color: "#333",
  },
  sliderValue: {
    margin: "0 0 12px 0",
    color: "#555",
    fontWeight: "600",
  },
  sliderInput: {
    width: "100%",
    marginBottom: "12px",
  },
  priceEditorRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  stepButton: {
    background: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "36px",
    height: "36px",
    cursor: "pointer",
    fontSize: "20px",
    lineHeight: "1",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    padding: "0 10px",
    flex: 1,
    minHeight: "36px",
  },
  currencyPrefix: {
    color: "#666",
    fontWeight: "600",
    marginRight: "6px",
  },
  priceInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "15px",
    color: "#333",
    background: "transparent",
  },
  savePriceBtn: {
    background: "#eb8d21",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  heroBox: {
  background: "linear-gradient(145deg, #f5f5f5, #e0e0e0)",
  padding: "45px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  animation: "fadeIn 0.6s ease",
},

heroTitle: {
  fontSize: "36px",
  fontWeight: "700",
  marginBottom: "10px",
  color: "#222",
},

heroSubtitle: {
  fontSize: "18px",
  color: "#555",
  marginBottom: "25px",
},

statsWrap: {
  display: "flex",
  justifyContent: "center",
  gap: "25px",
  marginTop: "25px",
  flexWrap: "wrap",
},

statCard: {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  width: "220px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
},

statLabel: {
  fontSize: "16px",
  color: "#555",
  marginBottom: "6px",
},

statValue: {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#EB8D21",
},

};