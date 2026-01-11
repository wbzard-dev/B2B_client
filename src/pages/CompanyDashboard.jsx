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
            <div className="glass-loading">Initializing Command Center...</div>
        );

    return (
        <div className="container" style={{ maxWidth: "1400px" }}>
            {/* Header Section - Floating Text */}
            <div className="dashboard-header">
                <div>
                    <h1
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: "700",
                            margin: 0,
                        }}
                    >
                        Hello, {user.name || "Alex"}
                    </h1>
                    <p
                        style={{
                            opacity: 0.8,
                            fontSize: "1.1rem",
                            marginTop: "0.5rem",
                        }}
                    >
                        Here is your daily command center update.
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div
                        style={{
                            fontSize: "1rem",
                            opacity: 0.8,
                            marginBottom: "0.5rem",
                        }}
                    >
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                    <div
                        className="badge badge-info"
                        style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
                    >
                        ID: {user.entityId}
                    </div>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="dashboard-grid-layout">
                {/* Revenue Card (Big Feature) */}
                <div className="glass-card feature-card">
                    <div className="card-header-row">
                        <span className="card-label">Total Revenue</span>
                        <span className="card-icon">💰</span>
                    </div>
                    <div className="big-value">
                        ₹{metrics.totalRevenue.toLocaleString()}
                    </div>
                    <div className="card-trend up">
                        <span>+12.5%</span> from last month
                    </div>
                    <div className="chart-placeholder"></div>
                </div>

                {/* Distributor Requests (Action Item) */}
                <div className="glass-card action-card">
                    <div className="card-header-row">
                        <span className="card-label">Distributor Requests</span>
                        <div className="notification-dot"></div>
                    </div>
                    <div className="mid-value">{metrics.pendingApprovals}</div>
                    <div className="card-status-text">Pending Approvals</div>
                    <Link
                        to="/distributors"
                        className="btn btn-primary glass-btn full-width"
                    >
                        Manage Requests
                    </Link>
                </div>

                {/* Payment Verification */}
                <div className="glass-card warning-card">
                    <div className="card-header-row">
                        <span className="card-label">Payment Verification</span>
                        <span className="card-icon">⚠️</span>
                    </div>
                    <div className="mid-value">{metrics.pendingPayments}</div>
                    <div className="card-status-text">Orders Pending</div>
                    <Link
                        to="/orders"
                        className="btn btn-secondary glass-btn full-width"
                    >
                        Review Orders
                    </Link>
                </div>

                {/* Low Stock (Critical) */}
                <div className="glass-card danger-card">
                    <div className="card-header-row">
                        <span className="card-label">Critical Inventory</span>
                        <span className="card-icon">📉</span>
                    </div>
                    <div className="mid-value">{metrics.lowStockItems}</div>
                    <div className="card-status-text">Items Low Stock</div>
                    <Link
                        to="/products"
                        className="btn btn-danger glass-btn full-width"
                    >
                        Restock Now
                    </Link>
                </div>

                {/* Recent Activity / Stats */}
                <div className="glass-card wide-card">
                    <div className="card-header-row">
                        <span className="card-label">Recent Activity</span>
                        <span className="card-icon">📊</span>
                    </div>
                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="stat-val">
                                {metrics.recentOrders}
                            </span>
                            <span className="stat-lbl">New Orders (7d)</span>
                        </div>
                        <div className="vertical-divider"></div>
                        <div className="stat-item">
                            <span className="stat-val success">98%</span>
                            <span className="stat-lbl">System Health</span>
                        </div>
                        <div className="vertical-divider"></div>
                        <div className="stat-item">
                            <Link
                                to="/products/new"
                                className="stat-action-link"
                            >
                                + Add Product
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
