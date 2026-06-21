import { type RegisterUserDto } from "../interfaces/RegisterUserDto";
import { type LoginUserDto } from "../interfaces/LoginUserDto";

const BASE_URL = 'http://localhost:8080/api/v1/spendingTracker/auth'

export const loginUser = async (data: LoginUserDto): Promise<Response> => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

   
    return response;
}

// Check if the token is valid
export const isTokenValid = async () => {
     const token = localStorage.getItem("token");
     if (!token) {
        return { ok: false, valid: false };
     }
     
     const response = await fetch(`${BASE_URL}/isTokenValid`, {
        method: "POST",
        headers: { 'Content-Type': 'text/plain' },
        body: token  // Send just the token string, not JSON
    });
    
    if (!response.ok) {
        return { ok: false, valid: false };
    }
    
    // The backend returns a boolean directly in the response body
    const isValid = await response.json();
    return { ok: response.ok, valid: isValid };
}

export const registerUser = async (user: RegisterUserDto): Promise<Response> => {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }); 
        return response;
}