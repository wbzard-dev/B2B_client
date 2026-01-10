import React, { useState, useEffect } from 'react';
import api from '../services/api';
import QuantitySelector from "../components/QuantitySelector";

const InventoryTracking = () => {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState(0);

    const fetchData = async () => {
        try {
            const [invRes, prodRes] = await Promise.all([
                api.get('/distributor/inventory'),
                api.get('/products')
            ]);
            setInventory(invRes.data);
            setProducts(prodRes.data);
        } catch (err) {
            console.error('Error fetching inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStock = async (productId) => {
        try {
            await api.post('/distributor/inventory/update', {
                productId,
                quantity: editValue
            });
            setEditingId(null);
            fetchData();
        } catch (err) {
            console.error('Error updating stock:', err);
            alert('Failed to update stock');
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Inventory...</div>;

    // Merge products and inventory for display
    const mergedInventory = products.map(prod => {
        const invItem = inventory.find(i => i.productId?._id === prod._id);
        return {
            ...prod,
            currentStock: invItem ? invItem.quantity : 0,
            lastUpdated: invItem ? invItem.lastUpdated : null
        };
    });

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Inventory Management</h1>
                <p style={{ color: 'var(--text-muted)' }}>Track and manage your current stock levels</p>
            </div>

            <div className="metric-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table className="responsive-table">
                        <thead style={{ background: 'var(--surface-alt)' }}>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th style={{ textAlign: 'center' }}>Current Stock</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mergedInventory.map(item => (
                                <tr key={item._id}>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {item.sku}</div>
                                    </td>
                                    <td>
                                        <span style={{
                                            background: 'var(--surface-alt)',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: 'var(--text-muted)'
                                        }}>{item.category}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {editingId === item._id ? (
                                            <QuantitySelector
                                                value={editValue}
                                                onChange={setEditValue}
                                                unit={item.unit}
                                            />
                                        ) : (
                                            <div style={{
                                                fontSize: '1.25rem',
                                                fontWeight: 800,
                                                color: item.currentStock < 10 ? 'var(--danger)' : 'var(--text-main)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}>
                                                {item.currentStock}
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.unit}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {editingId === item._id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                    onClick={() => handleUpdateStock(item._id)}
                                                >Save</button>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                    onClick={() => setEditingId(null)}
                                                >Cancel</button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.6rem 1.2rem', fontSize: '0.875rem', borderRadius: '10px' }}
                                                onClick={() => {
                                                    setEditingId(item._id);
                                                    setEditValue(item.currentStock);
                                                }}
                                            >Adjust Stock</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryTracking;
