import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        profileImage:
            user?.profileImage ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await api.put("/auth/update-profile", {
                name: formData.name,
                profileImage: formData.profileImage,
            });

            // Update context with backend response
            updateUser(res.data.user);

            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: "800px" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
                    My Profile
                </h1>
                <p style={{ color: "var(--text-muted)" }}>
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="metric-card" style={{ padding: "2rem" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "2rem",
                    }}
                >
                    <div
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "4px solid var(--surface)",
                            boxShadow: "0 0 0 4px var(--primary)",
                            marginBottom: "1rem",
                            position: "relative",
                        }}
                    >
                        <img
                            src={formData.profileImage}
                            alt="Profile"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                    <div style={{ width: "100%", maxWidth: "300px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: 600,
                                textAlign: "center",
                            }}
                        >
                            Profile Image URL
                        </label>
                        <input
                            type="text"
                            name="profileImage"
                            value={formData.profileImage}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="https://example.com/avatar.png"
                            style={{ textAlign: "center" }}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div
                        className="form-grid two-col"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: 600,
                                }}
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: 600,
                                }}
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="form-control"
                                style={{
                                    background: "var(--surface-alt)",
                                    cursor: "not-allowed",
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className="form-grid two-col"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: 600,
                                }}
                            >
                                Role
                            </label>
                            <input
                                type="text"
                                value={user?.role || "User"}
                                disabled
                                className="form-control"
                                style={{
                                    background: "var(--surface-alt)",
                                    cursor: "not-allowed",
                                    textTransform: "capitalize",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: 600,
                                }}
                            >
                                Entity Type
                            </label>
                            <input
                                type="text"
                                value={user?.entityType || "Company"}
                                disabled
                                className="form-control"
                                style={{
                                    background: "var(--surface-alt)",
                                    cursor: "not-allowed",
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                            style={{ padding: "0.75rem 2rem" }}
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
