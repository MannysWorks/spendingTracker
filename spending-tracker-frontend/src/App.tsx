import {
  Outlet,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Wallet from "./components/Wallet";

import "./css/App.css";

export function HomePage() {
  return (
    <motion.section
      className="app-content"
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -8,
      }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
      }}
    >
      <div className="dashboard-heading">
        <h1>Welcome Back!</h1>
      </div>

      <div className="dashboard-grid">
        <div className="wallet-column">
          <Wallet userName="Manny" />
        </div>

        <div className="analytics-column">
          <div className="analytics-placeholder">
            Monthly analytics will go here
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function ActivityPage() {
  return (
    <motion.section
      className="app-content"
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -8,
      }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
      }}
    >
      <div className="dashboard-heading">
        <h1>Activity</h1>
      </div>

      <div className="analytics-placeholder">
        Activity insights will go here.
      </div>
    </motion.section>
  );
}

function App() {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <button
            type="button"
            className="app-brand"
            onClick={() => navigate("/home")}
            aria-label="Mannys Spending Tracker home"
          >
            <span className="app-brand-name">
              Mannys
            </span>

            <span className="app-brand-subtitle">
              Spending Tracker
            </span>
          </button>

          <div className="app-navbar-container">
            <Navbar />
          </div>

          <div className="app-header-actions">
            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M13.75 21a2 2 0 01-3.5 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <span className="notification-indicator" />
            </button>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </main>
  );
}

export default App;