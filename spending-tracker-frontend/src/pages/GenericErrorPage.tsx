import { AlertTriangle, Home, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../css/GenericErrorPage.css";

export function GenericErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="error-page-bg">
            <motion.div
                className="error-page-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <div className="error-page-icon-wrapper">
                    <AlertTriangle size={40} color="#1a6e1a" strokeWidth={2} />
                </div>

                <h1 className="error-page-title">Something went wrong</h1>
                <p className="error-page-subtitle">
                    We hit an unexpected error loading this page. Your session may
                    still be active — try going home, or log in again if needed.
                </p>

                <div className="error-page-actions">
                    <button
                        className="btn rounded-15 error-page-btn error-page-btn--primary"
                        onClick={() => navigate("/")}
                    >
                        <Home size={18} />
                        Go home
                    </button>
                    <button
                        className="btn rounded-15 error-page-btn error-page-btn--secondary"
                        onClick={() => navigate("/login")}
                    >
                        <LogIn size={18} />
                        Log in
                    </button>
                </div>
            </motion.div>
        </div>
    );
}