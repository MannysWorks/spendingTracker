import Navbar from "./components/Navbar";
import Modal from "./components/Modals/Modal";
import { useState } from "react";
import './css/App.css'

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg">
        <div className="navbar-wrapper">
          <Navbar userName="Manny" />
          <button id="view-table-btn" onClick={() => setShowModal(true)}>Table</button>
          {showModal && <Modal onClose={() => setShowModal(false)} />}
        </div>
      </div>
    </>
  )
}
export default App;