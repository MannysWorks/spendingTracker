import Sidebar from "./components/SideBar";
import Modal from "./components/Modals/Modal";
import { useState } from "react";
import './css/App.css'
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  return (
    <>
      <div className="grid-bg" aria-hidden="true" />

      <Sidebar userName="Manny" onOpenTable={() => setShowModal(true)} />

      <div className="bg">
        <div className="navbar-wrapper">
          <Navbar userName="Manny" />
        </div>

        <AnimatePresence>
          {showModal && (
            <Modal
              key={refreshKey}
              onClose={() => setShowModal(false)}
              onRefresh={() => setRefreshKey((prev) => prev + 1)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
export default App;