import Navbar from "./components/Navbar";
import Modal from "./components/Modals/Modal";
import { useState } from "react";
import './css/App.css'
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg">
        <div className="navbar-wrapper">
          <Navbar userName="Manny" />
          <button id="view-table-btn" onClick={() => setShowModal(true)}>Table</button>
          <AnimatePresence>
            {showModal && (
              <Modal onClose={() => setShowModal(false)} />
            )}
          </AnimatePresence>
        </div>
      </div >
    </>
  )
}
export default App;