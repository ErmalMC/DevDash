// src/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "./api/api.js";
import "./register.css"; // Reuse Register styles

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!form.email || !form.password) {
            return setError("Please fill in all fields.");
        }

        try {
            setLoading(true);

            // Login via API
            const response = await authAPI.login({
                email: form.email,
                password: form.password
            });

            console.log("Login successful:", response);

            // Store token in localStorage
            if (response.token) {
                localStorage.setItem("token", response.token);

                // Store user info if available
                if (response.user) {
                    localStorage.setItem("user", JSON.stringify(response.user));
                }
            }

            // Redirect to main page
            navigate("/main");

        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div>
                    <h1 className="register-title">Welcome back</h1>
                    <p className="register-subtitle">
                        Sign in to your DevDash account.
                    </p>
                </div>

                {error && <div className="register-error">{error}</div>}

                <form onSubmit={onSubmit} className="register-form">
                    <div>
                        <label htmlFor="email" className="register-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            autoComplete="email"
                            className="register-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="register-label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={onChange}
                            autoComplete="current-password"
                            className="register-input"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="register-button"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="register-footer">
                    Don't have an account?{" "}
                    <Link to="/register" className="register-link">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}