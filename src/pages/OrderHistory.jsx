import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error('Error fetching orders', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            fetchOrders(); // Refresh
        } catch (err) {
            alert('Update failed');
        }
    };

    const handlePayment = async (id) => {
        if (!window.confirm('Simulate payment for this order?')) return;
        try {
            await api.put(`/orders/${id}/pay`);
            alert('Payment Submitted for Verification!');
            fetchOrders();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || 'Payment Failed';
            alert(`Payment Failed: ${msg}`);
        }
    };

    const verifyPayment = async (id) => {
        try {
            await api.put(`/orders/${id}/verify-payment`);
            alert('Payment Verified!');
            fetchOrders();
        } catch (err) {
            alert('Verification Failed');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return 'badge-warning';
            case 'Confirmed': return 'badge-info';
            case 'Shipped': return 'badge-info';
            case 'Delivered': return 'badge-success';
            case 'Canceled': return 'badge-danger';
            default: return '';
        }
    };

    const getPaymentBadge = (status) => {
        if (status === 'Paid') return { bg: '#dcfce7', color: '#166534' }; // Green
        if (status === 'Verification Pending') return { bg: '#fef9c3', color: '#854d0e' }; // Yellow
        return { bg: '#fee2e2', color: '#991b1b' }; // Red
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Order History</h2>
                <p style={{ color: 'var(--text-muted)' }}>Track past and current orders</p>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Payment Due</th>
                            <th>Total Amount</th>
                            <th>Order Status</th>
                            <th>Payment Status</th>
                            {user.entityType === 'Company' ? <th>Verification</th> : <th>Payment</th>}
                            {/* Extra Actions Column for Order Status (Company) */}
                            {user.entityType === 'Company' && <th>Ship/Deliver</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => {
                            const pStyle = getPaymentBadge(order.paymentStatus);
                            return (
                                <tr key={order._id}>
                                    <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{order._id.substring(order._id.length - 6).toUpperCase()}</span></td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {order.paymentDueDate ? (
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.9rem' }}>{new Date(order.paymentDueDate).toLocaleDateString()}</span>
                                                {new Date() > new Date(order.paymentDueDate) && order.paymentStatus !== 'Paid' && (
                                                    <span style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600 }}>Overdue</span>
                                                )}
                                            </div>
                                        ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>₹{order.totalAmount}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            background: pStyle.bg,
                                            color: pStyle.color,
                                            fontWeight: 600,
                                            fontSize: '0.75rem'
                                        }}>
                                            {order.paymentStatus || 'Pending'}
                                        </span>
                                    </td>

                                    {user.entityType === 'Company' && (
                                        <>
                                            <td>
                                                {order.paymentStatus === 'Verification Pending' && (
                                                    <button onClick={() => verifyPayment(order._id)} className="btn btn-success" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Verify Received</button>
                                                )}
                                                {order.paymentStatus === 'Pending' && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Waiting</span>}
                                                {order.paymentStatus === 'Paid' && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>✓ Verified</span>}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {order.status === 'Pending' && (
                                                        <button onClick={() => updateStatus(order._id, 'Confirmed')} className="btn btn-warning" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#f59e0b', color: 'white', border: 'none' }}>Confirm</button>
                                                    )}
                                                    {order.status === 'Confirmed' && (
                                                        <button onClick={() => updateStatus(order._id, 'Shipped')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Ship</button>
                                                    )}
                                                    {order.status === 'Shipped' && (
                                                        <button onClick={() => updateStatus(order._id, 'Delivered')} className="btn btn-success" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Deliver</button>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    )}

                                    {user.entityType === 'Distributor' && (
                                        <td>
                                            {order.paymentStatus !== 'Paid' && order.paymentStatus !== 'Verification Pending' && order.status !== 'Canceled' && (
                                                <button
                                                    onClick={() => handlePayment(order._id)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                            {order.paymentStatus === 'Verification Pending' && (
                                                <span style={{ fontSize: '0.8rem', color: '#854d0e' }}>Processing...</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            )
                        })}
                        {orders.length === 0 && <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistory;
