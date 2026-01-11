import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const DistributorDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        activeOrders: 0,
        totalSpend: 0,
        overdueCount: 0,
        nextPaymentDue: null,
        creditUsed: 0, // Simulated for now or calculated from unpaid orders
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderRes = await api.get("/orders");
                const orders = orderRes.data;

                const activeOrders = orders.filter(
                    (o) => o.status !== "Delivered" && o.status !== "Canceled"
                ).length;
                const totalSpend = orders.reduce(
                    (acc, curr) => acc + curr.totalAmount,
                    0
                );

                // Calculate overdue
                const now = new Date();
                const overdueOrders = orders.filter(
                    (o) =>
                        o.paymentStatus !== "Paid" &&
                        o.paymentDueDate &&
                        new Date(o.paymentDueDate) < now
                );
                const overdueCount = overdueOrders.length;

                // Next payment due
                const unpaid = orders.filter(
                    (o) =>
                        o.paymentStatus !== "Paid" &&
                        o.paymentDueDate &&
                        new Date(o.paymentDueDate) > now
                );
                unpaid.sort(
                    (a, b) =>
                        new Date(a.paymentDueDate) - new Date(b.paymentDueDate)
                );
                const nextPaymentDue =
                    unpaid.length > 0 ? unpaid[0].paymentDueDate : null;

                // Simulated Credit Used (Sum of all unpaid orders)
                const creditUsed = orders
                    .filter((o) => o.paymentStatus !== "Paid")
                    .reduce((acc, curr) => acc + curr.totalAmount, 0);

                setStats({
                    activeOrders,
                    totalSpend,
                    overdueCount,
                    nextPaymentDue,
                    creditUsed,
                });
            } catch (err) {
                console.error("Error fetching distributor dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="glass-loading">Loading Portal...</div>;

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
                        Welcome back, {user.name}
                    </h1>
                    <p
                        style={{
                            opacity: 0.8,
                            fontSize: "1.1rem",
                            marginTop: "0.5rem",
                        }}
                    >
                        Distributor Portal &bull; Account Status:{" "}
                        <span className="badge badge-success">Active</span>
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
                        Outstanding Balance
                    </div>
                    <div
                        className="big-value"
                        style={{ fontSize: "2.5rem", margin: "0" }}
                    >
                        ₹{stats.creditUsed.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div
                className="dashboard-grid-layout"
                style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
                {/* Status Card: Overdue (Critical) */}
                <div
                    className={`glass-card ${
                        stats.overdueCount > 0 ? "danger-card" : ""
                    }`}
                    style={{
                        gridColumn: "span 1",
                        borderTop:
                            stats.overdueCount > 0
                                ? "4px solid var(--danger)"
                                : "4px solid var(--success)",
                    }}
                >
                    <div className="card-header-row">
                        <span className="card-label">Payment Status</span>
                        <div
                            className={`notification-dot ${
                                stats.overdueCount > 0 ? "danger" : "success"
                            }`}
                        ></div>
                    </div>
                    <div
                        className="mid-value"
                        style={{
                            color:
                                stats.overdueCount > 0
                                    ? "var(--danger)"
                                    : "var(--success)",
                        }}
                    >
                        {stats.overdueCount > 0
                            ? `${stats.overdueCount} Overdue`
                            : "All Clear"}
                    </div>
                    <div className="card-status-text">
                        {stats.overdueCount > 0
                            ? "Action Required Immediately"
                            : "No pending dues"}
                    </div>
                </div>

                {/* Action Card: Catalog (Wide) */}
                <div
                    className="glass-card wide-card"
                    style={{ gridColumn: "span 2" }}
                >
                    <div className="card-header-row">
                        <span className="card-label">Quick Actions</span>
                        <span className="card-icon">⚡</span>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            marginTop: "auto",
                        }}
                    >
                        <Link
                            to="/products"
                            className="btn btn-primary glass-btn"
                        >
                            Browse Catalog & Place Order
                        </Link>
                        <Link
                            to="/sales-report"
                            className="btn btn-success glass-btn"
                        >
                            Report Daily Sales
                        </Link>
                        <Link
                            to="/orders"
                            className="btn btn-secondary glass-btn"
                        >
                            View Order History
                        </Link>
                        <Link
                            to="/inventory"
                            className="btn btn-secondary glass-btn"
                        >
                            Manage Physical Stock
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metrics Row */}
            <div
                className="dashboard-grid-layout"
                style={{ marginTop: "-1rem" }}
            >
                <div className="glass-card">
                    <div className="card-header-row">
                        <span className="card-label">Active Orders</span>
                    </div>
                    <div className="metric-value">{stats.activeOrders}</div>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            color: "var(--text-muted)",
                        }}
                    >
                        In process / Shipping
                    </p>
                </div>

                <div className="glass-card">
                    <div className="card-header-row">
                        <span className="card-label">Next Payment Due</span>
                    </div>
                    <div className="metric-value">
                        {stats.nextPaymentDue
                            ? new Date(
                                  stats.nextPaymentDue
                              ).toLocaleDateString()
                            : "N/A"}
                    </div>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            color: "var(--text-muted)",
                        }}
                    >
                        {stats.nextPaymentDue
                            ? "Upcoming invoice"
                            : "No upcoming payments"}
                    </p>
                </div>

                <div className="glass-card">
                    <div className="card-header-row">
                        <span className="card-label">Total Lifetime Spend</span>
                    </div>
                    <div className="metric-value">
                        ₹{stats.totalSpend.toLocaleString()}
                    </div>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            color: "var(--text-muted)",
                        }}
                    >
                        Thank you for your business
                    </p>
                </div>
                <div
                    className="glass-card"
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: 0.7,
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "2rem" }}>📞</div>
                        <div style={{ marginTop: "0.5rem" }}>
                            Contact Support
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistributorDashboard;
