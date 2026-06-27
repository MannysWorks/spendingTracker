// src/Services/AuthProvider.tsx
import { createContext, useState, useEffect, type PropsWithChildren } from "react";
import type { User } from "../types/User";
import { isTokenValid } from "./AuthenticateUserService";

type AuthProviderProps = PropsWithChildren & {
    isSighnedIn?: boolean;
}

// Export the context
export const AuthContext = createContext<User | null>(null);

export const AuthProvider = ({ children, isSighnedIn }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(isSighnedIn ? { id: 1 } : null);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const result = await isTokenValid();
                console.log("Token validation result:", result);

                if (result.ok && result.valid) {
                    setUser({ id: 1 });
                } else {
                    console.warn("Token validation failed:", result);
                    setUser(null);
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Token validation error:", error);
                setUser(null);
                localStorage.removeItem("token");
            }
        };

        if (localStorage.getItem("token")) {
            validateToken();
        }
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}