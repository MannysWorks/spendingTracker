import { useState } from "react";
import "../css/Navbar.css"
import ModalForm from "./Modals/ModalForm";
import { AnimatePresence, motion } from "framer-motion";

function Navbar({ userName }: { userName: string }) {
    const [showModalForm, setShowModalForm] = useState(false);

    return (
        <nav className="navbar">
            {/* Left side */}
            <a className="navbar-brand navbar-title m-0" href="#">
                {userName}'s Spending Tracker
            </a>
            <a className="navbar-brand navbar-title-display-small-screens m-0" href="#">
                {userName}, it's time to start traking!
            </a>

            {/* Right side */}
            <div className="ms-2">
                {/* Button to trigger the modal for adding entries */}
                <motion.button
                    whileHover={{ scale: 1.5, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className="add-entry" onClick={() => setShowModalForm(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 34 34" id="Add-1--Streamline-Core" height="30" width="30">
                        <desc>
                            Add 1 Streamline Icon: https://streamlinehq.com
                        </desc>
                        <g id="add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math">
                            <path id="Vector" stroke="#1a6e1a" stroke-linecap="round" stroke-linejoin="round" d="M17 1.2142857142857142v31.57142857142857" stroke-width="2.4286"></path>
                            <path id="Vector_2" stroke="#1a6e1a" stroke-linecap="round" stroke-linejoin="round" d="M1.2142857142857142 16.902759999999997h31.57142857142857" stroke-width="2.4286"></path>
                        </g>
                    </svg>
                </motion.button>
                <AnimatePresence>
                    {/* The modal for adding entries */}
                    {showModalForm && (
                        <ModalForm key="modal-form" onClose={() => setShowModalForm(false)} />
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}

export default Navbar;