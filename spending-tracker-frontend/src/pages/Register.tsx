import { type RegisterUserDto } from "../interfaces/RegisterUserDto";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { registerUser } from "../Services/AuthenticateUserService";
import "../css/Login.css";
import { NavbarIcon } from "../assets/icons/Icons";

export const Register = ({ onLoginClick }: { onLoginClick: () => void }) => {
    // Form register configuration
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterUserDto>();
    const [showModalForm, setShowModalForm] = useState(true);

    // State to hold any registration error messages
    const [registerError, setRegisterError] = useState<string | null>(null);

    // Handle form submission to register a new user
    const onSubmit: SubmitHandler<RegisterUserDto> = async (data) => {
        if (data) {
            const response = await registerUser(data);
            if (response.ok) {
                onLoginClick();
            } else {
                const error = await response.text();
                setRegisterError(error || "Registration failed. Please try again.");
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
                        <h2>Create an account</h2>
                        <p>Sign up to get started</p>

                        {registerError && (
                            <div className="alert-danger">{registerError}</div>
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
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    autoComplete="username"
                                    {...register("UserName", {
                                        required: "Username is required.",
                                    })}
                                />
                                {errors.UserName && (
                                    <span className="error">{errors.UserName.message}</span>
                                )}
                            </div>

                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
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
                                {isSubmitting ? "Creating account..." : "Sign up"}
                            </button>
                            <p className="register-prompt d-flex align-items-center">
                                Already have an account?
                                <button
                                    type="button"
                                    className="link-btn"
                                    onClick={onLoginClick}
                                >
                                    Log in
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};