import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <nav style={{ background: 'var(--bg-dark)', borderBottom: '1px solid var(--border)' }}>
            <div className="container" style={{ padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%' }}>
                <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '6px' }}></div>
                    B2B Platform
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {isAuthenticated ? (
                        <>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Link to="/" className={isActive('/')} style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>Dashboard</Link>
                                <Link to="/products" className={isActive('/products')} style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>Products</Link>
                                <Link to="/orders" className={isActive('/orders')} style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>Orders</Link>
                                {user?.entityType === 'Company' && (
                                    <Link to="/distributors" className={isActive('/distributors')} style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>Distributors</Link>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1rem', borderLeft: '1px solid #334155' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{user?.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.entityType}</div>
                                </div>
                                <button onClick={logout} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" className="btn" style={{ color: 'var(--text-muted)', background: 'transparent' }}>Login</Link>
                            <Link to="/register-company" className="btn btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .nav-link.active { color: white !important; }
                .nav-link:hover { color: white !important; }
            `}</style>
        </nav>
    );
};

export default Navbar;
