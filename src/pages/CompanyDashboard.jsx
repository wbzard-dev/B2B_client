import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const CompanyDashboard = ({ user }) => {
    const [metrics, setMetrics] = useState({
        pendingApprovals: 0,
        pendingPayments: 0,
        lowStockItems: 0,
        totalRevenue: 0,
        recentOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [distRes, prodRes, orderRes] = await Promise.all([
                    api.get("/distributors"),
                    api.get("/products"),
                    api.get("/orders"),
                ]);

                const pendingApprovals = distRes.data.filter(
                    (d) => d.status === "Pending"
                ).length;
                const pendingPayments = orderRes.data.filter(
                    (o) => o.paymentStatus === "Verification Pending"
                ).length;
                const lowStockItems = prodRes.data.filter(
                    (p) => p.stock < 10
                ).length;
                const totalRevenue = orderRes.data.reduce(
                    (acc, curr) =>
                        acc +
                        (curr.paymentStatus === "Paid" ? curr.totalAmount : 0),
                    0
                );
                const recentOrders = orderRes.data.filter(
                    (o) =>
                        new Date(o.createdAt) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length; // Last 7 days

                setMetrics({
                    pendingApprovals,
                    pendingPayments,
                    lowStockItems,
                    totalRevenue,
                    recentOrders,
                });
            } catch (err) {
                console.error("Error fetching company dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading)
        return (
            <div
                className="container"
                style={{ paddingTop: "4rem", textAlign: "center" }}
            >
                Initializing Command Center...
            </div>
        );

    return (
        <div className="container">
            {/* Dark Header Strip */}
            <div className="dashboard-header">
                <div>
                    <h1
                        style={{
                            fontSize: "2.25rem",
                            fontWeight: 800,
                            marginBottom: "0.5rem",
                            letterSpacing: "-0.025em",
                        }}
                    >
                        Command Center
                    </h1>
                    <p style={{ opacity: 0.7, fontFamily: "monospace" }}>
                        ADMIN_ID:{" "}
                        <span
                            style={{
                                background: "rgba(255,255,255,0.1)",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "4px",
                            }}
                        >
                            {user.entityId}
                        </span>
                    </p>
                </div>
                <div>
                    <div
                        style={{
                            fontSize: "3rem",
                            fontWeight: 800,
                            lineHeight: 1,
                        }}
                    >
                        ₹{metrics.totalRevenue.toLocaleString()}
                    </div>
                    <div
                        style={{
                            opacity: 0.7,
                            fontSize: "0.875rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                        }}
                    >
                        Total Revenue
                    </div>
                </div>
            </div>

            {/* Action Required Section */}
            <h2
                style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "1rem",
                    color: "var(--text-muted)",
                }}
            >
                Attention Needed
            </h2>
            <div className="dashboard-grid" style={{ marginBottom: "3rem" }}>
                {/* Pending Approvals */}
                <div
                    className="metric-card"
                    style={{
                        borderLeft: "none",
                        borderTop: "4px solid var(--primary)",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            padding: "0.5rem",
                            opacity: 0.1,
                            fontSize: "4rem",
                            fontWeight: 800,
                        }}
                    >
                        users
                    </div>
                    <div className="metric-title">Distributor Requests</div>
                    <div className="metric-value">
                        {metrics.pendingApprovals}
                    </div>
                    <Link
                        to="/distributors"
                        className="btn btn-primary"
                        style={{
                            marginTop: "1rem",
                            width: "-webkit-fill-available",
                        }}
                    >
                        Manage Approvals
                    </Link>
                </div>

                {/* Pending Payments */}
                <div
                    className="metric-card"
                    style={{
                        borderLeft: "none",
                        borderTop: "4px solid var(--warning)",
                    }}
                >
                    <div className="metric-title">Verify Payments</div>
                    <div className="metric-value">
                        {metrics.pendingPayments}
                    </div>
                    <Link
                        to="/orders"
                        className="btn"
                        style={{
                            marginTop: "1rem",
                            width: "-webkit-fill-available",
                            background: "#fffbeb",
                            color: "#b45309",
                            border: "1px solid #fcd34d",
                        }}
                    >
                        Review Orders
                    </Link>
                </div>

                {/* Low Stock */}
                <div
                    className="metric-card"
                    style={{
                        borderLeft: "none",
                        borderTop: "4px solid var(--danger)",
                    }}
                >
                    <div className="metric-title">Critical Inventory</div>
                    <div className="metric-value">{metrics.lowStockItems}</div>
                    <Link
                        to="/products"
                        className="btn btn-danger"
                        style={{
                            marginTop: "1rem",
                            width: "-webkit-fill-available",
                        }}
                    >
                        Restock Now
                    </Link>
                </div>
            </div>

            {/* Overview Section */}
            <h2
                style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "1rem",
                    color: "var(--text-muted)",
                }}
            >
                System Overview
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                }}
            >
                <div
                    className="card"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "var(--text-muted)",
                            }}
                        >
                            Orders (Last 7 Days)
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                            {metrics.recentOrders}
                        </div>
                    </div>
                </div>

                <div
                    className="card"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <div
                        style={{
                            background: "#ecfdf5",
                            padding: "0.75rem",
                            borderRadius: "50%",
                            color: "#059669",
                        }}
                    >
                        <svg
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "var(--text-muted)",
                            }}
                        >
                            System Health
                        </div>
                        <div
                            style={{
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "#059669",
                            }}
                        >
                            Operational
                        </div>
                    </div>
                </div>

                <div
                    className="card"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <Link
                        to="/products/new"
                        className="btn btn-secondary"
                        style={{ width: "-webkit-fill-available" }}
                    >
                        + Add New Product
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
