import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    return (
        <div className="app-container">
            {/* Mobile Header */}
            <header className="mobile-header">
                <button
                    className="btn-hamburger"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            d="M3 12h18M3 6h18M3 18h18"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <span className="mobile-brand">B2B Platform</span>
            </header>

            {/* Sidebar with mobile props */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
