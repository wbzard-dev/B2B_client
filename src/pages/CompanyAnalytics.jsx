import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CompanyAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics/company');
                setData(res.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Analytics...</div>;
    if (!data) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Error loading data.</div>;

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Business Analytics</h1>
                <p style={{ color: 'var(--text-muted)' }}>Overview of restocking operations and distributor sales performance</p>
            </div>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                <div className="metric-card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>TOTAL RESTOCKING (VALUE)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{data.summary.totalRestocking.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.5rem' }}>From fulfilled orders</div>
                </div>

                <div className="metric-card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>TOTAL DISTRIBUTOR SALES</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>₹{data.summary.totalDistSales.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.5rem' }}>Reported by distributors</div>
                </div>

                <div className="metric-card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>ACTIVE DISTRIBUTORS</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{data.summary.activeDistributors}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Engaged in business</div>
                </div>

                <div className="metric-card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>SALES REPORTS RECEIVED</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{data.summary.salesCount}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Daily reports processed</div>
                </div>
            </div>

            {/* Performance Table */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Distributor Performance</h2>
                <div className="table-container">
                    <table className="responsive-table">
                        <thead>
                            <tr>
                                <th>Distributor Name</th>
                                <th>Total Sales Report</th>
                                <th>Total Restock Amount</th>
                                <th>Sales Reports</th>
                                <th>Restock Events</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.distributorPerformance.map(dist => (
                                <tr key={dist.id}>
                                    <td><strong>{dist.name}</strong></td>
                                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>₹{dist.totalSales.toLocaleString()}</td>
                                    <td style={{ fontWeight: 600 }}>₹{dist.totalRestocking.toLocaleString()}</td>
                                    <td>{dist.salesCount}</td>
                                    <td>{dist.restockCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Manual Restocking Activities</h2>
                    {data.recentActivity.manualRestocks.map(log => (
                        <div key={log._id} className="metric-card" style={{ padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontWeight: 700 }}>
                                        {log.userId?.name} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>restocked</span> {log.productId?.name}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        {new Date(log.createdAt).toLocaleString()} &bull; <em>"{log.reason}"</em>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 800, color: 'var(--success)', background: 'var(--success-bg)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                                    +{log.change}
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.recentActivity.manualRestocks.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No manual restocking logs found.</p>}
                </div>

                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Order-based Deliveries</h2>
                    {data.recentActivity.restocks.map(restock => (
                        <div key={restock._id} className="metric-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{restock.distributorId?.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(restock.updatedAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{restock.totalAmount.toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                    {data.recentActivity.restocks.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No recent restocking data.</p>}
                </div>
            </div>
        </div>
    );
};

export default CompanyAnalytics;
