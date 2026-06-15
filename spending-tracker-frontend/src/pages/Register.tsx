import { type RegisterUserDto } from "../interfaces/RegisterUserDto";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import GenericModal from "../components/Modals/GenericModal";
import { registerUser } from "../Services/AuthenticateUserService";

export const Register = ({ onLoginClick }: { onLoginClick: () => void }) => {
    //Form register configuration
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterUserDto>();
    const [showModalForm, setShowModalForm] = useState(true);

    // Handle form submission to register a new user
    const onSubmit: SubmitHandler<RegisterUserDto> = async (data) => {
        if (data) {
            const response = await registerUser(data);
            if (response.ok) {
                console.log("User registered successfully!");
            } else {
                const error = await response.text();
                console.error("Registration failed: ", error);
            }
        }
        console.log(data);
    };

    return (
        //TODO: Refactor this to a separate component and reuse the modal for both login and register forms
        showModalForm && (
            <GenericModal
                onClose={() => setShowModalForm(false)}
                title={"Register"}
                body={
                    <div className="login-container">
                        <h2>Create an account</h2>
                        <p>Sign up to get started</p>

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
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    autoComplete="username"
                                    {...register("UserName", {
                                        required: "Username is required."
                                    })}
                                />
                                {errors.UserName && <span className="error">{errors.UserName.message}</span>}
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
                                {errors.Password && <span className="error">{errors.Password.message}</span>}
                            </div>

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating account..." : "Sign up"}
                            </button>
                            <p className="register-prompt d-flex align-items-center">
                                Already have an account?
                                <button type="button" className="link-btn" onClick={onLoginClick}>
                                    Log in
                                </button>
                            </p>
                        </form>
                    </div>
                }
            />
        ));
};