import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import GenericModal from "../components/Modals/GenericModal";

type LoginInputs = {
    email: string;
    password: string;
};

export const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInputs>();
    const [showModalForm, setShowModalForm] = useState(true);

    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        // TODO: call your auth API here
        console.log(data);
    };

    return (
        showModalForm && (
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
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Please enter a valid email address.",
                                        },
                                    })}
                                />
                                {errors.email && <span className="error">{errors.email.message}</span>}
                            </div>

                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters.",
                                        },
                                    })}
                                />
                                {errors.password && <span className="error">{errors.password.message}</span>}
                            </div>

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>
                        </form>
                    </div>
                }
            />
        ));
};