import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "./services/api";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: "CITIZEN", // Default to CITIZEN
        acceptTerms: false,
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

        // Validation
        if (!form.fullName || !form.email || !form.phoneNumber || !form.password || !form.confirmPassword) {
            return setError("Please fill in all fields.");
        }
        if (form.password.length < 8) {
            return setError("Password must be at least 8 characters.");
        }
        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match.");
        }
        if (!form.acceptTerms) {
            return setError("You must accept the terms to continue.");
        }

        // Phone number validation
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(form.phoneNumber.replace(/[\s-]/g, ''))) {
            return setError("Please enter a valid phone number.");
        }

        try {
            setLoading(true);

            // Register via API - matches your RegisterDTO
            const response = await authAPI.register({
                fullName: form.fullName,
                email: form.email,
                phoneNumber: form.phoneNumber,
                password: form.password,
                role: form.role // "CITIZEN" or "WORKER"
            });

            console.log("Registration successful:", response);

            // Show success and redirect
            alert("Registration successful! Please log in.");
            navigate("/login");

        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div>
                    <h1 className="register-title">Create account</h1>
                    <p className="register-subtitle">
                        Sign up to start using DevDash.
                    </p>
                </div>

                {error ? <div className="register-error">{error}</div> : null}

                <form onSubmit={onSubmit} className="register-form">
                    <div>
                        <label htmlFor="fullName" className="register-label">
                            Full name
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            value={form.fullName}
                            onChange={onChange}
                            autoComplete="name"
                            className="register-input"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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
                        <label htmlFor="phoneNumber" className="register-label">
                            Phone Number
                        </label>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={form.phoneNumber}
                            onChange={onChange}
                            autoComplete="tel"
                            className="register-input"
                            placeholder="+38970123456"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="register-label">
                            I want to register as
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={onChange}
                            className="register-input"
                            required
                        >
                            <option value="CITIZEN">Citizen (Request Services)</option>
                            <option value="WORKER">Worker (Provide Services)</option>
                        </select>
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
                            autoComplete="new-password"
                            className="register-input"
                            placeholder="At least 8 characters"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="register-label">
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={onChange}
                            autoComplete="new-password"
                            className="register-input"
                            placeholder="Repeat password"
                            required
                        />
                    </div>

                    <label className="register-terms">
                        <input
                            name="acceptTerms"
                            type="checkbox"
                            checked={form.acceptTerms}
                            onChange={onChange}
                            className="register-checkbox"
                            required
                        />
                        <span>
                            I agree to the{" "}
                            <a href="/terms" className="register-link">
                                Terms
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="register-link">
                                Privacy Policy
                            </a>
                            .
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="register-button"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="register-footer">
                    Already have an account?{" "}
                    <Link to="/login" className="register-link">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}