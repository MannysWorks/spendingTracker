import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { type LoginUserDto } from "../interfaces/LoginUserDto";
import { type LoginResponse } from "../interfaces/LoginResponse";
import { loginUser } from "../Services/AuthenticateUserService";
import { Alert } from "react-bootstrap";
import "../css/Login.css";
import { NavbarIcon } from "../assets/icons/Icons";



interface LoginProps {
    onRegisterClick: () => void;
}

export const Login = ({ onRegisterClick }: LoginProps) => {
    // Form login configuration
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginUserDto>();
    const [showModalForm] = useState(true);

    // State to hold any login error messages
    const [loginError, setLoginError] = useState<string | null>(null);

    // Handle form submission
    const onSubmit: SubmitHandler<LoginUserDto> = async (data) => {
        if (data) {
            const response = await loginUser(data);
            if (response.ok) {
                const loginResponse: LoginResponse = await response.json();
                localStorage.setItem("token", loginResponse.token);
                // Redirect to the main app page after successful login
                window.location.href = "/home";
            } else {
                setLoginError("Invalid email or password.");
            }
        }
    };

    return (
        <>
            <div className="logo-wrapper">
                <NavbarIcon size={40} color="#1a6e1a" />
            </div>
            {showModalForm && (
                <div className="login-page">
                    <div className="login-container">
                        <h2 id="welcome-message">Welcome Back Twin!</h2>
                        <p>Sign in to your account</p>

                        {/* Display login error message if there is one */}
                        {loginError && (
                            <Alert
                                key="login-error"
                                variant="danger"
                                className="alert-danger"
                                dismissible
                                onClose={() => setLoginError(null)}
                            >
                                {loginError}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    autoComplete="email"
                                    {...register("Email", {
                                        required: "Email is required.",
                                    })}
                                />
                                {errors.Email && (
                                    <span className="error">{errors.Email.message}</span>
                                )}
                            </div>
                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    {...register("Password", {
                                        required: "Password is required.",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters.",
                                        },
                                    })}
                                />
                                {errors.Password && (
                                    <span className="error">{errors.Password.message}</span>
                                )}
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>
                            <p className="register-prompt d-flex align-items-center">
                                Don't have an account?
                                <button
                                    type="button"
                                    className="link-btn"
                                    onClick={onRegisterClick}
                                >
                                    Register
                                </button>
                            </p>

                        </form>
                    </div>

                </div>
            )}

        </>
    );
};