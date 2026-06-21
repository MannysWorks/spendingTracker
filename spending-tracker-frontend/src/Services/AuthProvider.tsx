import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import type { User } from "../types/User";
import { isTokenValid } from "./AuthenticateUserService";

type AuthProviderProps = PropsWithChildren & {
    isSighnedIn?: boolean;
}

const AuthContext = createContext<User | null>(null);

export const AuthProvider = ({ children, isSighnedIn }: AuthProviderProps) => {

    const [User, setUser] = useState<User | null>(isSighnedIn ? { id: 1 } : null);

    // Validate token on app load
    useEffect(() => {
        const validateToken = async () => {
            try {
                const result = await isTokenValid();
                console.log("Token validation result:", result);
                
                if (result.ok && result.valid) {
                    setUser({ id: 1 }); // Token is valid, set user
                } else {
                    console.warn("Token validation failed:", result);
                    setUser(null); // Token is invalid, clear user
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Token validation error:", error);
                setUser(null);
                localStorage.removeItem("token");
            }
        };

        // Only validate if there's a token in localStorage
        if (localStorage.getItem("token")) {
            validateToken();
        }
    }, []);

    return <AuthContext.Provider value={User}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}