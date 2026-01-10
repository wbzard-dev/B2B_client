import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CompanyDashboard from "./CompanyDashboard";
import DistributorDashboard from "./DistributorDashboard";

const Dashboard = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
        if (!loading && user?.role === "company_user") {
            navigate("/products");
        }
    }, [loading, isAuthenticated, user, navigate]);

    if (loading) {
        return (
            <div
                className="container"
                style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
                }}
            >
                Loading...
            </div>
        );
    }

    if (!user) return null; // Should redirect

    if (user.entityType === "Company") {
        return <CompanyDashboard user={user} />;
    } else if (user.entityType === "Distributor") {
        return <DistributorDashboard user={user} />;
    } else {
        return (
            <div
                className="container"
                style={{ padding: "2rem", textAlign: "center" }}
            >
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        marginBottom: "1rem",
                    }}
                >
                    Unknown Role
                </h2>
                <p style={{ color: "var(--text-muted)" }}>
                    Your account does not have a valid role assigned. Please
                    contact support.
                </p>
            </div>
        );
    }
};

export default Dashboard;
