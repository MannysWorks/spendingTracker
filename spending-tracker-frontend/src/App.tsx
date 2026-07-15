import Navbar from "./components/Navbar";
import Modal from "./components/Modals/Modal";
import { useState } from "react";
import './css/App.css'
import { AnimatePresence, motion } from "framer-motion";
import { NavbarIcon } from "./assets/icons/Icons";

// Main app component that renders the navbar and the modal for the table view. 
function App() {
  const [showModal, setShowModal] = useState(false);
  // This state is used to trigger a refresh of the table view when a new entry is added.
  //  The modal will call the onRefresh function passed as a prop, which will update the refreshKey state and cause the Modal component to re-render with the new data.
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>

      <div className="logo-wrapper">
        <NavbarIcon size={40} color="#335237" />
      </div>

      <div className="grid-bg" aria-hidden="true" />

      <button
        className="btn logout-btn "
        onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
      >
        Logout
      </button>
      <div className="bg">
        <div className="navbar-wrapper">
          <Navbar userName="Manny" />
          {/* This button in the navbar triggers the modal for viewing the table. */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="btn rounded-15 mt-3 border-0"
            id="view-table-btn" onClick={() => setShowModal(true)}>
            <img className="streamline-icon" src="Layer-Blur--Streamline-Sharp.png" alt=""></img>
          </motion.button>
          <AnimatePresence>
            {/* The modal for viewing the table */}
            {showModal && (
              <Modal key={refreshKey} onClose={() => setShowModal(false)} onRefresh={() => setRefreshKey(prev => prev + 1)} />
            )}
          </AnimatePresence>
        </div>
      </div >

    </>
  )
}
export default App;