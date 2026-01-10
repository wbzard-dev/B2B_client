import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) =>
        location.pathname === path ? "sidebar-link active" : "sidebar-link";

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!isAuthenticated) return null;

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <Link to="/" className="brand-logo">
                    <div className="logo-icon"></div>
                    <span className="logo-text">B2B Platform</span>
                </Link>
                {/* Mobile Close Button */}
                <button className="btn-close-sidebar" onClick={onClose}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            d="M6 18L18 6M6 6l12 12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-label">Menu</span>
                    {user?.role !== "company_user" && (
                        <Link to="/" className={isActive("/")}>
                            Dashboard
                        </Link>
                    )}
                    <Link to="/products" className={isActive("/products")}>
                        Products
                    </Link>
                    <Link to="/orders" className={isActive("/orders")}>
                        Orders
                    </Link>
                    {user?.role === "company_admin" && (
                        <>
                            <Link
                                to="/distributors"
                                className={isActive("/distributors")}
                            >
                                Distributors
                            </Link>
                            <Link
                                to="/analytics"
                                className={isActive("/analytics")}
                            >
                                Analytics
                            </Link>
                            <Link
                                to="/employees"
                                className={isActive("/employees")}
                            >
                                Employees
                            </Link>
                        </>
                    )}
                    {user?.entityType === "Distributor" && (
                        <>
                            <Link
                                to="/inventory"
                                className={isActive("/inventory")}
                            >
                                Inventory
                            </Link>
                            <Link
                                to="/sales-report"
                                className={isActive("/sales-report")}
                            >
                                Sales Report
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-name">{user?.name}</div>
                    <div className="user-role">{user?.entityType}</div>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
