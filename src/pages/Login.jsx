import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(formData.email, formData.password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.msg || "Login Failed");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--surface-alt)",
            }}
        >
            <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: "var(--text-main)",
                        }}
                    >
                        Welcome Back
                    </h2>
                    <p style={{ color: "var(--text-muted)" }}>
                        Sign in to your account
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#dc2626",
                            padding: "0.75rem",
                            borderRadius: "var(--radius-md)",
                            marginBottom: "1rem",
                            fontSize: "0.875rem",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            required
                            placeholder="you@company.com"
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={onChange}
                                required
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line
                                            x1="1"
                                            y1="1"
                                            x2="23"
                                            y2="23"
                                        ></line>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            marginTop: "1rem",
                        }}
                    >
                        Sign In
                    </button>
                </form>

                <div
                    style={{
                        marginTop: "1.5rem",
                        textAlign: "center",
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                    }}
                >
                    Don't have an account?{" "}
                    <Link to="/register-company">Register Company</Link> or{" "}
                    <Link to="/register-distributor">Distributor</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
