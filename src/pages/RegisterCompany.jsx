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
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--surface-alt)",
                padding: "2rem",
            }}
        >
            <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: "var(--text-main)",
                        }}
                    >
                        Register Company
                    </h2>
                    <p style={{ color: "var(--text-muted)" }}>
                        Start managing your supply chain today
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
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={onChange}
                            required
                            placeholder="Acme Inc."
                        />
                    </div>
                    <div className="input-group">
                        <label>Admin Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            required
                            placeholder="admin@acme.com"
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
                                placeholder="Create a strong password"
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
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                            marginTop: "1.5rem",
                        }}
                    >
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1, padding: "0.75rem" }}
                        >
                            Create Account
                        </button>
                    </div>
                </form>
                <div
                    style={{
                        marginTop: "1rem",
                        textAlign: "center",
                        fontSize: "0.875rem",
                    }}
                >
                    <Link to="/login" style={{ color: "var(--text-muted)" }}>
                        Already have an account? Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterCompany;
