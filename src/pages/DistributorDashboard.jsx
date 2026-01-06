import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const DistributorDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        activeOrders: 0,
        totalSpend: 0,
        overdueCount: 0,
        nextPaymentDue: null,
        creditUsed: 0 // Simulated for now or calculated from unpaid orders
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderRes = await api.get('/orders');
                const orders = orderRes.data;

                const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Canceled').length;
                const totalSpend = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

                // Calculate overdue
                const now = new Date();
                const overdueOrders = orders.filter(o => o.paymentStatus !== 'Paid' && o.paymentDueDate && new Date(o.paymentDueDate) < now);
                const overdueCount = overdueOrders.length;

                // Next payment due
                const unpaid = orders.filter(o => o.paymentStatus !== 'Paid' && o.paymentDueDate && new Date(o.paymentDueDate) > now);
                unpaid.sort((a, b) => new Date(a.paymentDueDate) - new Date(b.paymentDueDate));
                const nextPaymentDue = unpaid.length > 0 ? unpaid[0].paymentDueDate : null;

                // Simulated Credit Used (Sum of all unpaid orders)
                const creditUsed = orders.filter(o => o.paymentStatus !== 'Paid').reduce((acc, curr) => acc + curr.totalAmount, 0);

                setStats({ activeOrders, totalSpend, overdueCount, nextPaymentDue, creditUsed });
            } catch (err) {
                console.error('Error fetching distributor dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading Portal...</div>;

    return (
        <div className="container">
            {/* Header Section */}
            <div style={{
                marginBottom: '3rem',
                background: 'linear-gradient(135deg, var(--bg-dark) 0%, #1e1b4b 100%)',
                padding: '3rem',
                borderRadius: '1rem',
                color: 'white',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>Welcome back, {user.name}</h1>
                        <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Distributor Portal &bull; Account Status: <span style={{ color: '#4ade80', fontWeight: 600 }}>Active</span></p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.25rem' }}>Outstanding Balance</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700 }}>₹{stats.creditUsed.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="dashboard-grid" style={{ gap: '2rem' }}>

                {/* Action Card: Catalog */}
                <div className="metric-card" style={{
                    gridColumn: 'span 2',
                    background: 'linear-gradient(to right bottom, #fff, #f8fafc)',
                    borderLeft: 'none',
                    borderTop: '4px solid var(--primary)'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/products" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Browse Catalog & Place Order</Link>
                        <Link to="/orders" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>View Order History</Link>
                    </div>
                </div>

                {/* Status Card: Overdue */}
                <div className="metric-card" style={{
                    background: stats.overdueCount > 0 ? '#fee2e2' : '#f0fdf4',
                    borderLeft: 'none',
                    border: stats.overdueCount > 0 ? '1px solid #fca5a5' : '1px solid #86efac'
                }}>
                    <div className="metric-title" style={{ color: stats.overdueCount > 0 ? '#991b1b' : '#166534' }}>
                        {stats.overdueCount > 0 ? 'Action Required' : 'Payment Status'}
                    </div>
                    <div className="metric-value" style={{ color: stats.overdueCount > 0 ? '#991b1b' : '#166534' }}>
                        {stats.overdueCount > 0 ? `${stats.overdueCount} Overdue` : 'All Clear'}
                    </div>
                    {stats.overdueCount > 0 && <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#dc2626' }}>Please clear immediately</div>}
                </div>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div className="metric-card" style={{ borderLeftColor: 'var(--primary)' }}>
                    <div className="metric-title">Active Orders</div>
                    <div className="metric-value">{stats.activeOrders}</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>In process / Shipping</p>
                </div>

                <div className="metric-card" style={{ borderLeftColor: 'var(--secondary)' }}>
                    <div className="metric-title">Next Payment Due</div>
                    <div className="metric-value" style={{ fontSize: '1.5rem' }}>
                        {stats.nextPaymentDue ? new Date(stats.nextPaymentDue).toLocaleDateString() : 'N/A'}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {stats.nextPaymentDue ? 'Upcoming invoice' : 'No upcoming payments'}
                    </p>
                </div>

                <div className="metric-card" style={{ borderLeftColor: 'var(--success)' }}>
                    <div className="metric-title">Total Lifetime Spend</div>
                    <div className="metric-value">₹{stats.totalSpend.toLocaleString()}</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Thank you for your business</p>
                </div>
            </div>
        </div>
    );
};

export default DistributorDashboard;
