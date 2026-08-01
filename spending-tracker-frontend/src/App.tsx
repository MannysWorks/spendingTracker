import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Modal from "./components/Modals/Modal";
import Herobanner from "./components/HeroBanner";

import "./css/App.css";

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-brand-name">Mannys</span>
          <span className="app-brand-subtitle">
            Spending Tracker
          </span>
        </div>

        <div className="app-navbar-container">
          <Navbar onOpenTable={() => setShowModal(true)} />
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
      </header>

      <div className="bg">
        <div className="hero-wrapper">
          <Herobanner userName="Manny" />
        </div>

        <AnimatePresence>
          {showModal && (
            <Modal
              key={refreshKey}
              onClose={() => setShowModal(false)}
              onRefresh={() =>
                setRefreshKey((previous) => previous + 1)
              }
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;