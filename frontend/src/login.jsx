import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, setAuthToken } from "./api/api.js";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
            return setError("Please fill in all fields.");
        }

        try {
            setLoading(true);

            // Login via API - matches your LoginDTO
            const response = await authAPI.login({
                email: form.email,
                password: form.password
            });

            console.log("Login successful:", response);

            // Store token and user info
            setAuthToken(response.token);
            localStorage.setItem("user", JSON.stringify({
                userId: response.userId,
                email: response.email,
                fullName: response.fullName,
                role: response.role // This is already a string from your AuthResponse
            }));

            // Trigger storage event for other components
            window.dispatchEvent(new Event("storage"));

            // Redirect based on role
            if (response.role === "WORKER") {
                navigate("/profile");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div>
                    <h1 className="login-title">Welcome back</h1>
                    <p className="login-subtitle">
                        Sign in to your DevDash account.
                    </p>
                </div>

                {error ? <div className="login-error">{error}</div> : null}

                <form onSubmit={onSubmit} className="login-form">
                    <div>
                        <label htmlFor="email" className="login-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            autoComplete="email"
                            className="login-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="login-label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={onChange}
                            autoComplete="current-password"
                            className="login-input"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="login-options">
                        <label className="login-remember">
                            <input
                                name="rememberMe"
                                type="checkbox"
                                checked={form.rememberMe}
                                onChange={onChange}
                                className="login-checkbox"
                            />
                            <span>Remember me</span>
                        </label>

                        <Link to="/forgot-password" className="login-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-button"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="login-footer">
                    Don't have an account?{" "}
                    <Link to="/register" className="login-link">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}