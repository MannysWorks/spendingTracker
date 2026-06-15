import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import GenericModal from "../components/Modals/GenericModal";
import { type LoginUserDto } from "../interfaces/LoginUserDto";
import { type LoginResponse } from "../interfaces/LoginResponse";
import { loginUser } from "../Services/AuthenticateUserService";

export const Login = ({ onRegisterClick }: { onRegisterClick: () => void }) => {
    //Form login configuration
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginUserDto>();
    const [showModalForm, setShowModalForm] = useState(true);

    // Handle form submission
    const onSubmit: SubmitHandler<LoginUserDto> = async (data) => {
        if (data) {
            const response = await loginUser(data);
            if (response.ok) {
                const loginResponse: LoginResponse = await response.json();
                console.log(loginResponse);
                localStorage.setItem("token", loginResponse.token);
            }
            console.log(data);
        }
    };

    return (
        <>
            {showModalForm && (
                <GenericModal
                    onClose={() => setShowModalForm(false)}
                    title={"Login"}
                    body={
                        <div className="login-container">
                            <h2>Welcome back</h2>
                            <p>Sign in to your account</p>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="field">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email address"
                                        autoComplete="email"
                                        {...register("Email", {
                                            required: "Email is required."
                                        })}
                                    />
                                    {errors.Email && <span className="error">{errors.Email.message}</span>}
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
                                    {errors.Password && <span className="error">{errors.Password.message}</span>}
                                </div>
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Signing in..." : "Sign in"}
                                </button>
                                <p className="register-prompt d-flex align-items-center">
                                    Don't have an account?
                                    <button type="button" className="link-btn" onClick={onRegisterClick}>
                                        Register
                                    </button>
                                </p>
                            </form>
                        </div>
                    }
                />
            )}
        </>
    )
};