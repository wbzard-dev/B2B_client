import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DistributorList = () => {
    const [distributors, setDistributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchDistributors = async () => {
        try {
            const res = await api.get("/distributors");
            setDistributors(res.data);
        } catch (err) {
            console.error("Error fetching distributors", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user?.entityType === "Company") {
            fetchDistributors();
        }
    }, [user]);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/distributors/${id}/status`, { status });
            fetchDistributors(); // Refresh
        } catch (err) {
            alert("Update failed");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Pending":
                return "badge-warning";
            case "Active":
                return "badge-success";
            case "Suspended":
                return "badge-danger";
            case "Rejected":
                return "badge-danger";
            default:
                return "badge-info";
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.875rem", fontWeight: 700 }}>
                    Distributor Management
                </h2>
                <p style={{ color: "var(--text-muted)" }}>
                    Approve or manage your distributors
                </p>
            </div>

            <div className="table-container">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Distributor Name</th>
                            <th>Contact Info</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {distributors.map((dist) => (
                            <tr key={dist._id}>
                                <td
                                    data-label="Distributor Name"
                                    style={{ fontWeight: 600 }}
                                >
                                    {dist.name}
                                </td>
                                <td data-label="Contact Info">
                                    <div>
                                        {dist.contactPerson?.name || "N/A"}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        {dist.contactPerson?.email}
                                    </div>
                                </td>
                                <td data-label="Status">
                                    <span
                                        className={`badge ${getStatusBadge(
                                            dist.status
                                        )}`}
                                    >
                                        {dist.status}
                                    </span>
                                </td>
                                <td data-label="Joined Date">
                                    {new Date(
                                        dist.createdAt
                                    ).toLocaleDateString()}
                                </td>
                                <td data-label="Actions">
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        {dist.status === "Pending" && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            dist._id,
                                                            "Active"
                                                        )
                                                    }
                                                    className="btn btn-success"
                                                    style={{
                                                        padding:
                                                            "0.25rem 0.5rem",
                                                        fontSize: "0.75rem",
                                                    }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            dist._id,
                                                            "Rejected"
                                                        )
                                                    }
                                                    className="btn btn-danger"
                                                    style={{
                                                        padding:
                                                            "0.25rem 0.5rem",
                                                        fontSize: "0.75rem",
                                                    }}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {dist.status === "Active" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        dist._id,
                                                        "Suspended"
                                                    )
                                                }
                                                className="btn btn-danger"
                                                style={{
                                                    padding: "0.25rem 0.5rem",
                                                    fontSize: "0.75rem",
                                                }}
                                            >
                                                Suspend
                                            </button>
                                        )}
                                        {dist.status === "Suspended" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        dist._id,
                                                        "Active"
                                                    )
                                                }
                                                className="btn btn-success"
                                                style={{
                                                    padding: "0.25rem 0.5rem",
                                                    fontSize: "0.75rem",
                                                }}
                                            >
                                                Reactivate
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {distributors.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    style={{
                                        padding: "2rem",
                                        textAlign: "center",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    No distributors found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DistributorList;
