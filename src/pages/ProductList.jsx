import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import QuantitySelector from "../components/QuantitySelector";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                setProducts(res.data);
                setFilteredProducts(res.data);
            } catch (err) {
                console.error("Error fetching products", err);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const lower = searchQuery.toLowerCase();
        setFilteredProducts(
            products.filter(
                (p) =>
                    p.name.toLowerCase().includes(lower) ||
                    p.sku.toLowerCase().includes(lower) ||
                    (p.category && p.category.toLowerCase().includes(lower))
            )
        );
    }, [searchQuery, products]);

    const handleQuantityChange = (productId, val) => {
        setQuantities({ ...quantities, [productId]: val });
    };

    const handlePlaceOrder = async () => {
        const items = Object.keys(quantities)
            .filter((id) => quantities[id] > 0)
            .map((id) => ({
                productId: id,
                quantity: quantities[id],
            }));

        if (items.length === 0) {
            alert("Please select at least one item");
            return;
        }

        try {
            await api.post("/orders", { items });
            alert("Order Placed Successfully!");
            navigate("/orders");
        } catch (err) {
            alert("Order Failed: " + (err.response?.data?.msg || err.message));
        }
    };

    const [showHistory, setShowHistory] = useState(null); // Product for history
    const [historyLogs, setHistoryLogs] = useState([]);

    const handleRestock = async (product) => {
        const adjustmentStr = prompt(
            `Add stock to ${product.name} (Current: ${product.stock}):`,
            "0"
        );
        if (adjustmentStr !== null && adjustmentStr !== "0") {
            const adjustmentVal = parseInt(adjustmentStr);
            if (isNaN(adjustmentVal) || adjustmentVal === 0) {
                alert("Invalid adjustment value");
                return;
            }

            const reason = prompt("Enter reason for restocking:", adjustmentVal > 0 ? "Regular Restock" : "Adjustment");
            if (reason === null) return; // Cancel if no reason

            try {
                const res = await api.put(`/products/${product._id}`, { stockAdjustment: adjustmentVal, reason });
                // Update with server response to be sure
                const updated = products.map((p) =>
                    p._id === product._id ? { ...p, stock: res.data.stock } : p
                );
                setProducts(updated);
                alert(`Stock successfully ${adjustmentVal > 0 ? 'added' : 'reduced'}!`);
            } catch (err) {
                console.error(err);
                alert("Failed to update stock: " + (err.response?.data?.msg || err.message));
            }
        }
    };

    const fetchHistory = async (product) => {
        try {
            const res = await api.get(`/products/${product._id}/logs`);
            setHistoryLogs(res.data);
            setShowHistory(product);
        } catch (err) {
            alert("Failed to fetch history");
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0)
            return { label: "Out of Stock", color: "#ef4444", bg: "#fee2e2" }; // Red
        if (stock < 10)
            return { label: "Low Stock", color: "#d97706", bg: "#fef3c7" }; // Amber
        return { label: "In Stock", color: "#166534", bg: "#dcfce7" }; // Green
    };

    if (loading)
        return (
            <div
                className="container"
                style={{ paddingTop: "4rem", textAlign: "center" }}
            >
                Loading Catalog...
            </div>
        );

    const totalSelected = Object.keys(quantities).filter(
        (id) => quantities[id] > 0
    ).length;

    return (
        <div className="container">
            {/* Stock History Modal */}
            {showHistory && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>Stock History: {showHistory.name}</h3>
                            <button className="btn-close" onClick={() => setShowHistory(null)}>&times;</button>
                        </div>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '1rem' }}>
                            <table className="responsive-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>User</th>
                                        <th>Change</th>
                                        <th>Stock</th>
                                        <th>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyLogs.map(log => (
                                        <tr key={log._id}>
                                            <td style={{ fontSize: '0.8rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                                            <td style={{ fontSize: '0.8rem' }}>{log.userId?.name}</td>
                                            <td style={{ color: log.change > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                                                {log.change > 0 ? `+${log.change}` : log.change}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{log.newStock}</td>
                                            <td style={{ fontSize: '0.8rem' }}>{log.reason}</td>
                                        </tr>
                                    ))}
                                    {historyLogs.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>No history found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowHistory(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="page-header">
                <div>
                    <h1>Product Catalog</h1>
                    <p style={{ color: "var(--text-muted)" }}>
                        {user.entityType === "Company"
                            ? "Manage your inventory and pricing"
                            : "Browse products and replenish stock"}
                    </p>
                </div>
                <div className="page-actions">
                    {user?.entityType === "Distributor" &&
                        totalSelected > 0 && (
                            <div
                                style={{
                                    fontWeight: 600,
                                    color: "var(--primary)",
                                }}
                            >
                                {totalSelected} items in cart
                            </div>
                        )}

                    {user?.entityType === "Distributor" && (
                        <button
                            onClick={handlePlaceOrder}
                            className="btn btn-primary"
                            style={{
                                padding: "0.75rem 1.5rem",
                                boxShadow:
                                    "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
                            }}
                        >
                            Review & Place Order
                        </button>
                    )}
                    {user?.role === "company_admin" && (
                        <Link
                            to="/products/new"
                            className="btn btn-primary"
                            style={{ display: "flex", gap: "0.5rem" }}
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 4v16m8-8H4"></path>
                            </svg>
                            Add Product
                        </Link>
                    )}
                </div>
            </div>

            {/* Toolbar: Search & Stats */}
            <div className="filters-bar">
                <div className="search-wrapper">
                    <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        style={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                        }}
                    >
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: "2.5rem", width: "auto" }}
                    />
                </div>
                <div className="stats-group">
                    <div>
                        Total Products:{" "}
                        <span
                            style={{
                                fontWeight: 600,
                                color: "var(--text-main)",
                            }}
                        >
                            {filteredProducts.length}
                        </span>
                    </div>
                    {user?.entityType === "Company" && (
                        <div>
                            Low Stock:{" "}
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: "var(--danger)",
                                }}
                            >
                                {products.filter((p) => p.stock < 10).length}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Modern Table */}
            <div
                className="table-container"
                style={{
                    background: "var(--surface)",
                    boxShadow: "var(--shadow-md)",
                    border: "none",
                }}
            >
                <table
                    className="responsive-table"
                    style={{ minWidth: "100%" }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: "35%" }}>Product</th>
                            <th style={{ width: "15%" }}>Price</th>
                            <th style={{ width: "15%" }}>Status</th>
                            <th style={{ width: "15%" }}>Category</th>
                            <th style={{ width: "20%", textAlign: "right" }}>
                                {user.entityType === "Company"
                                    ? "Actions"
                                    : "Order Qty"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => {
                            const status = getStockStatus(product.stock);
                            return (
                                <tr
                                    key={product._id}
                                    style={{ transition: "background 0.1s" }}
                                >
                                    <td data-label="Product">
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "1rem",
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    background:
                                                        "var(--surface-alt)",
                                                    borderRadius: "8px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "var(--text-muted)",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {product.sku.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        color: "var(--text-main)",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {product.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "var(--text-muted)",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    SKU:{" "}
                                                    <span
                                                        style={{
                                                            fontFamily:
                                                                "monospace",
                                                        }}
                                                    >
                                                        {product.sku}
                                                    </span>{" "}
                                                    &bull; {product.unit}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Price">
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontWeight: 600 }}>
                                                ₹
                                                {product.price.toLocaleString()}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "var(--text-muted)",
                                                }}
                                            >
                                                per {product.unit}
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Status">
                                        <span
                                            style={{
                                                background: status.bg,
                                                color: status.color,
                                                padding: "0.25rem 0.75rem",
                                                borderRadius: "999px",
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {status.label} ({product.stock})
                                        </span>
                                    </td>
                                    <td data-label="Category">
                                        <span
                                            style={{
                                                background:
                                                    "var(--surface-alt)",
                                                padding: "0.2rem 0.5rem",
                                                borderRadius: "4px",
                                                fontSize: "0.8rem",
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            {product.category || "General"}
                                        </span>
                                    </td>

                                    <td
                                        data-label={
                                            user.entityType === "Company"
                                                ? "Actions"
                                                : "Order Qty"
                                        }
                                        style={{ textAlign: "right" }}
                                    >
                                        {user?.entityType === "Distributor" && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    width: "100%",
                                                }}
                                            >
                                                <QuantitySelector
                                                    value={quantities[product._id] || 0}
                                                    onChange={(val) => handleQuantityChange(product._id, val)}
                                                    max={product.stock}
                                                    unit={product.unit}
                                                />
                                            </div>
                                        )}
                                        {user.entityType === "Company" && (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() =>
                                                        handleRestock(product)
                                                    }
                                                    className="btn"
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        padding: "0.4rem 0.8rem",
                                                        border: "1px solid var(--border)",
                                                        background: "white",
                                                    }}
                                                >
                                                    Adjust Stock
                                                </button>
                                                <button
                                                    onClick={() => fetchHistory(product)}
                                                    className="btn btn-secondary"
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        padding: "0.4rem 0.8rem",
                                                    }}
                                                >
                                                    History
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td
                                    colSpan="5"
                                    style={{
                                        padding: "4rem",
                                        textAlign: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "var(--text-muted)",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        No products found matching "
                                        {searchQuery}"
                                    </div>
                                    {user?.role === "company_admin" && (
                                        <Link
                                            to="/products/new"
                                            className="btn btn-primary"
                                        >
                                            Add New Product
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
