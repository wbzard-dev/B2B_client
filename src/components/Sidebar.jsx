import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ? "sidebar-link active" : "sidebar-link";

    if (!isAuthenticated) return null;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link to="/" className="brand-logo">
                    <div className="logo-icon"></div>
                    <span className="logo-text">B2B Platform</span>
                </Link>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-label">Menu</span>
                    <Link to="/" className={isActive("/")}>
                        Dashboard
                    </Link>
                    <Link to="/products" className={isActive("/products")}>
                        Products
                    </Link>
                    <Link to="/orders" className={isActive("/orders")}>
                        Orders
                    </Link>
                    {user?.entityType === "Company" && (
                        <Link
                            to="/distributors"
                            className={isActive("/distributors")}
                        >
                            Distributors
                        </Link>
                    )}
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-name">{user?.name}</div>
                    <div className="user-role">{user?.entityType}</div>
                </div>
                <button onClick={logout} className="btn-logout">
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
