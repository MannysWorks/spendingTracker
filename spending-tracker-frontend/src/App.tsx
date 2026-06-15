import Navbar from "./components/Navbar";
import Modal from "./components/Modals/Modal";
import { useState } from "react";
import './css/App.css'
import { AnimatePresence, motion } from "framer-motion";
import { ExpandIcon } from "./assets/icons/Icons";

//
function App() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>
      <div className="bg">
        <div className="navbar-wrapper">
          <Navbar userName="Manny" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn rounded-15 mt-3 border-0"
            id="view-table-btn" onClick={() => setShowModal(true)}>
            <ExpandIcon size={40} color="#1a6e1a" />
          </motion.button>
          <AnimatePresence>
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