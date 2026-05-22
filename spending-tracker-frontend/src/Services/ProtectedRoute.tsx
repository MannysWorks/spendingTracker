import { useAuth } from "./AuthProvider";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";


export function ProtectedRoute() {
    const user = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (user === null) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    return <Outlet />;
}