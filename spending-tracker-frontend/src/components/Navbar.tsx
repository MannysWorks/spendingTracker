import { useLocation, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

interface NavbarProps {
    onOpenTable: () => void;
}

function Navbar({ onOpenTable }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string): boolean => {
        return location.pathname === path;
    };

    return (
        <nav className="floating-navbar" aria-label="Main navigation">
            <button
                type="button"
                className={`navbar-link ${isActive("/") || isActive("/home") ? "active" : ""
                    }`}
                onClick={() => navigate("/home")}
            >
                Home
            </button>

            <button
                type="button"
                className="navbar-link"
                onClick={onOpenTable}
            >
                Table
            </button>

            <button
                type="button"
                className={`navbar-link ${isActive("/activity") ? "active" : ""
                    }`}
                onClick={() => navigate("/activity")}
            >
                Activity
            </button>
        </nav>
    );
}

export default Navbar;