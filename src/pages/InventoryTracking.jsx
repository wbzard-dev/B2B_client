import React, { useState, useEffect } from "react";
import api from "../services/api";
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
                api.get("/distributor/inventory"),
                api.get("/products"),
            ]);
            setInventory(invRes.data);
            setProducts(prodRes.data);
        } catch (err) {
            console.error("Error fetching inventory:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStock = async (productId) => {
        try {
            await api.post("/distributor/inventory/update", {
                productId,
                quantity: editValue,
            });
            setEditingId(null);
            fetchData();
        } catch (err) {
            console.error("Error updating stock:", err);
            alert("Failed to update stock");
        }
    };

    if (loading)
        return (
            <div
                className="container"
                style={{ padding: "4rem", textAlign: "center" }}
            >
                Loading Inventory...
            </div>
        );

    // Merge products and inventory for display
    const mergedInventory = products.map((prod) => {
        const invItem = inventory.find((i) => i.productId?._id === prod._id);
        return {
            ...prod,
            currentStock: invItem ? invItem.quantity : 0,
            lastUpdated: invItem ? invItem.lastUpdated : null,
        };
    });

    return (
        <div className="container" style={{ maxWidth: "1200px" }}>
            {/* Header Section */}
            <div className="dashboard-header" style={{ marginBottom: "2rem" }}>
                <div>
                    <h1
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: 800,
                            margin: 0,
                        }}
                    >
                        Inventory Management
                    </h1>
                    <p
                        style={{
                            color: "var(--text-muted)",
                            fontSize: "1.1rem",
                        }}
                    >
                        Track and manage your current stock levels
                    </p>
                </div>
                {/* Could add a search bar or filter here later */}
            </div>

            {/* Inventory Grid Layout */}
            <div
                className="dashboard-grid-layout"
                style={{
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.5rem",
                }}
            >
                {mergedInventory.map((item) => (
                    <div
                        key={item._id}
                        className="glass-card item-card"
                        style={{
                            padding: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        {/* Card Header: Name and SKU */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <div>
                                <h3
                                    style={{
                                        fontSize: "1.1rem",
                                        fontWeight: 700,
                                        color: "var(--text-main)",
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    {item.name}
                                </h3>
                                <span
                                    className="badge badge-secondary"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    SKU: {item.sku}
                                </span>
                            </div>
                            <span
                                className="badge"
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    color: "var(--text-muted)",
                                }}
                            >
                                {item.category}
                            </span>
                        </div>

                        {/* Card Body: Stock Level */}
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "1rem 0",
                            }}
                        >
                            {editingId === item._id ? (
                                <QuantitySelector
                                    value={editValue}
                                    onChange={setEditValue}
                                    unit={item.unit}
                                />
                            ) : (
                                <>
                                    <div
                                        style={{
                                            fontSize: "2.5rem",
                                            fontWeight: 800,
                                            color:
                                                item.currentStock < 10
                                                    ? "var(--danger)"
                                                    : "var(--text-main)",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {item.currentStock}
                                    </div>
                                    <span
                                        style={{
                                            fontSize: "0.875rem",
                                            color: "var(--text-muted)",
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        {item.unit} in stock
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Card Footer: Actions */}
                        <div style={{ marginTop: "auto" }}>
                            {editingId === item._id ? (
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "0.5rem",
                                    }}
                                >
                                    <button
                                        className="btn btn-primary glass-btn"
                                        style={{ width: "100%" }}
                                        onClick={() =>
                                            handleUpdateStock(item._id)
                                        }
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-secondary glass-btn"
                                        style={{ width: "100%" }}
                                        onClick={() => setEditingId(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-secondary glass-btn"
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                    }}
                                    onClick={() => {
                                        setEditingId(item._id);
                                        setEditValue(item.currentStock);
                                    }}
                                >
                                    Adjust Stock
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {mergedInventory.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "4rem",
                        color: "var(--text-muted)",
                    }}
                >
                    No inventory items found.
                </div>
            )}
        </div>
    );
};

export default InventoryTracking;
