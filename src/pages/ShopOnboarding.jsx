import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ShopOnboarding = () => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        phoneNumber: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear error on change
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Using /distributor/shop-data based on the router structure
            await api.post("/distributors/shop-data", {
                ...formData,
                distributorId: user?._id,
            });
            setSuccess("Shop onboarded successfully!");
            setFormData({
                name: "",
                location: "",
                phoneNumber: "",
            });
            // Optional: Navigate away or stay to add more
            // setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            console.error("Error onboarding shop:", err);
            const msg =
                err.response?.data?.msg ||
                err.response?.data ||
                "Failed to onboard shop. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container"
            style={{ maxWidth: "600px", padding: "2rem" }}
        >
            <div className="card">
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        marginBottom: "1.5rem",
                    }}
                >
                    Shop Onboarding
                </h2>
                <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                    Enter the details of the new shop to onboard them into the
                    system.
                </p>

                {error && (
                    <div
                        className="alert alert-error"
                        style={{
                            marginBottom: "1rem",
                            padding: "0.75rem",
                            background: "#fee2e2",
                            color: "#dc2626",
                            borderRadius: "0.5rem",
                        }}
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="alert alert-success"
                        style={{
                            marginBottom: "1rem",
                            padding: "0.75rem",
                            background: "#dcfce7",
                            color: "#16a34a",
                            borderRadius: "0.5rem",
                        }}
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>
                            Shop Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            required
                            placeholder="e.g. Sunshine General Store"
                            className="form-input"
                        />
                    </div>

                    <div className="input-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={onChange}
                            placeholder="e.g. Market Road, Mumbai"
                            className="form-input"
                        />
                    </div>

                    <div className="input-group">
                        <label>Phone Number</label>
                        <input
                            type="number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={onChange}
                            placeholder="e.g. 9876543210"
                            className="form-input"
                        />
                    </div>

                    <div style={{ marginTop: "2rem" }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: "100%", padding: "0.75rem" }}
                            disabled={loading}
                        >
                            {loading ? "Onboarding..." : "Onboard Shop"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShopOnboarding;
