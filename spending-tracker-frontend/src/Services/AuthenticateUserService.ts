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

export const registerUser = async (user: RegisterUserDto): Promise<Response> => {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }); 
        return response;
}