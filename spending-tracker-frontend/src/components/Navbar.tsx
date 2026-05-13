import { useState } from "react";
import "../css/Navbar.css"
import ModalForm from "./Modals/ModalForm";

function Navbar({ userName }: { userName: string }) {
    const [showModalForm, setShowModalForm] = useState(false);

    return (
        <nav className="navbar">
            {/* Left side */}
            <a className="navbar-brand navbar-title mb-0" href="#">
                <img
                    src="src/assets/spendingTrackNavImg.svg"
                    alt="Logo"
                    width="30"
                    height="24"
                    className="d-inline-block me-2 align-middle"
                />
                {userName}'s Spending Tracker
            </a>

            {/* Right side */}
            <div className="ms-auto">
                <button className="add-entry" onClick={() => setShowModalForm(true)}>
                    <div className="add-entry-btn-wrapper">
                        <img
                            className="add-entry-btn-img"
                            src="src/assets/addEntryBtn.png"
                            alt="Button Image"
                        />
                        <img
                            className="add-entry-btn-img-highlited"
                            src="src/assets/addEntryBtn(Highlighted).png"
                            alt="Button Image Highlighted"
                        />
                    </div>
                </button>
                {showModalForm && <ModalForm onClose={() => setShowModalForm(false)} />}
            </div>
        </nav>
    )
}

export default Navbar;