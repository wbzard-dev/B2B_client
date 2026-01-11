import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterCompany = () => {
    const [formData, setFormData] = useState({
        companyName: "",
        name: "",
        email: "",
        password: "",
    });
    const { registerCompany } = useAuth();
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
        try {
            await registerCompany(formData);
            navigate("/");
        } catch (err) {
            setError(
                "Registration Failed. Email or Company might already exist."
            );
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                {/* Left Side (Form) */}
                <div className="auth-form-side">
                    <h2 className="auth-title">Register Company</h2>

                    {error && (
                        <div
                            style={{
                                background: "#fee2e2",
                                color: "#dc2626",
                                padding: "0.75rem",
                                borderRadius: "0.5rem",
                                marginBottom: "1rem",
                                fontSize: "0.875rem",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit}>
                        <div className="auth-input-group">
                            <label className="auth-label">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={onChange}
                                required
                                placeholder="Acme Inc."
                                className="auth-input"
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Admin Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                                required
                                placeholder="John Doe"
                                className="auth-input"
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                required
                                placeholder="admin@acme.com"
                                className="auth-input"
                            />
                        </div>
                        <div className="auth-input-group">
                            <label className="auth-label">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={onChange}
                                    required
                                    placeholder="Create a strong password"
                                    className="auth-input"
                                    style={{ paddingRight: "3rem" }}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: "absolute",
                                        right: "1rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#94a3b8",
                                    }}
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                            }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                            }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="auth-btn">
                            Create Account
                        </button>
                    </form>
                    <div className="auth-footer-text">
                        <Link to="/login" className="auth-link">
                            Already have an account? Sign In
                        </Link>
                    </div>
                </div>

                {/* Right Side (Brand) */}
                <div className="auth-brand-side">
                    <div style={{ position: "relative", zIndex: 10 }}>
                        <div
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "800",
                                marginBottom: "1rem",
                            }}
                        >
                            <img
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                }}
                                src="https://ik.imagekit.io/ugdlmxlzt/Screenshot%202026-01-11%20at%206.35.57%E2%80%AFPM.png"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCompany;
