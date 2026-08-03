import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import "../css/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (
        paths: string[],
    ): boolean => {
        return paths.includes(location.pathname);
    };

    return (
        <nav
            className="floating-navbar"
            aria-label="Main navigation"
        >
            <button
                type="button"
                className={`navbar-link ${isActive(["/", "/home"])
                        ? "active"
                        : ""
                    }`}
                onClick={() => navigate("/home")}
                aria-current={
                    isActive(["/", "/home"])
                        ? "page"
                        : undefined
                }
            >
                Home
            </button>

            <button
                type="button"
                className={`navbar-link ${isActive(["/table", "/entries"])
                        ? "active"
                        : ""
                    }`}
                onClick={() => navigate("/table")}
                aria-current={
                    isActive(["/table", "/entries"])
                        ? "page"
                        : undefined
                }
            >
                Table
            </button>

            <button
                type="button"
                className={`navbar-link ${isActive(["/activity"])
                        ? "active"
                        : ""
                    }`}
                onClick={() =>
                    navigate("/activity")
                }
                aria-current={
                    isActive(["/activity"])
                        ? "page"
                        : undefined
                }
            >
                Activity
            </button>
        </nav>
    );
}

export default Navbar;