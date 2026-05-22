import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { User } from "../types/User";

type AuthProviderProps = PropsWithChildren & {
    isSighnedIn?: boolean;
}

const AuthContext = createContext<User | null>(null);

export const AuthProvider = ({ children, isSighnedIn }: AuthProviderProps) => {

    const [User] = useState<User | null>(isSighnedIn ? { id: 1 } : null);

    return <AuthContext.Provider value={User}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}