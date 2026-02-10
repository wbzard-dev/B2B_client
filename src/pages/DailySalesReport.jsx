import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QuantitySelector from "../components/QuantitySelector";

const DailySalesReport = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [salesItems, setSalesItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, invRes] = await Promise.all([
                    api.get("/products"),
                    api.get("/distributor/inventory"),
                ]);
                setProducts(prodRes.data);
                setInventory(invRes.data);
                // Initialize with an empty item
                setSalesItems([
                    { productId: "", quantity: 1, price: 0, shopName: "" },
                ]);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddItem = () => {
        setSalesItems([
            ...salesItems,
            { productId: "", quantity: 1, price: 0, shopName: "" },
        ]);
    };

    const handleRemoveItem = (index) => {
        const newItems = salesItems.filter((_, i) => i !== index);
        setSalesItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...salesItems];
        newItems[index][field] = value;

        // Auto-fill price if product is selected
        if (field === "productId") {
            const product = products.find((p) => p._id === value);
            if (product) {
                newItems[index].price = product.price;
            }
        }

        setSalesItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validItems = salesItems.filter(
            (item) => item.productId && item.quantity > 0,
        );
        if (validItems.length === 0) {
            alert("Please add at least one valid product");
            return;
        }

        // VALIDATION: Check stock levels
        for (const item of validItems) {
            const invItem = inventory.find(
                (i) => i.productId?._id === item.productId,
            );
            const availableStock = invItem ? invItem.quantity : 0;
            const product = products.find((p) => p._id === item.productId);

            if (item.quantity > availableStock) {
                alert(
                    `Insufficient stock for ${product?.name}. Available: ${availableStock}`,
                );
                return;
            }
        }

        setSubmitting(true);
        console.log("Submitting Sales Report Payload:", {
            items: validItems,
            date: new Date(),
        });
        try {
            await api.post("/distributor/sales/report", {
                items: validItems,
                date: new Date(),
            });
            alert("Sales report submitted successfully");
            navigate("/");
        } catch (err) {
            console.error("Error submitting sales report:", err);
            alert("Failed to submit report");
        } finally {
            setSubmitting(false);
        }
    };

    const totalReportAmount = salesItems.reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0,
    );

    if (loading)
        return (
            <div
                className="container"
                style={{ padding: "4rem", textAlign: "center" }}
            >
                Loading Portal...
            </div>
        );

    return (
        <div className="container" style={{ maxWidth: "900px" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1
                    style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        marginBottom: "0.5rem",
                    }}
                >
                    Daily Sales Report
                </h1>
                <p style={{ color: "var(--text-muted)" }}>
                    Report your sales for today to update inventory and track
                    performance
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="metric-card"
                style={{ padding: "2rem" }}
            >
                <div style={{ marginBottom: "1.5rem" }}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: 600,
                        }}
                    >
                        Date
                    </label>
                    <input
                        type="text"
                        value={new Date().toLocaleDateString()}
                        disabled
                        className="form-control"
                        style={{ background: "var(--surface-alt)" }}
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "1.25rem",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                        }}
                    >
                        Sales Items
                    </label>
                    {salesItems.map((item, index) => {
                        const selectedProduct = products.find(
                            (p) => p._id === item.productId,
                        );
                        const invItem = inventory.find(
                            (i) => i.productId?._id === item.productId,
                        );
                        const maxQuantity = invItem ? invItem.quantity : 0;

                        return (
                            <div key={index} className="sales-item-grid">
                                <div className="sales-item-product">
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "var(--text-muted)",
                                            marginBottom: "8px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        Product
                                    </label>
                                    <select
                                        className="form-control"
                                        value={item.productId}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "productId",
                                                e.target.value,
                                            )
                                        }
                                        required
                                        style={{
                                            borderRadius: "10px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((p) => {
                                            const invItemOption =
                                                inventory.find(
                                                    (i) =>
                                                        i.productId?._id ===
                                                        p._id,
                                                );
                                            const stock = invItemOption
                                                ? invItemOption.quantity
                                                : 0;
                                            return (
                                                <option
                                                    key={p._id}
                                                    value={p._id}
                                                    disabled={stock <= 0}
                                                >
                                                    {p.name} (Stock: {stock})
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="sales-item-shop">
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "var(--text-muted)",
                                            marginBottom: "8px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        Shop Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item.shopName || ""}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "shopName",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter Shop Name"
                                        style={{
                                            borderRadius: "10px",
                                            fontWeight: 600,
                                        }}
                                    />
                                </div>
                                <div className="sales-item-quantity">
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        Quantity
                                    </label>
                                    <QuantitySelector
                                        value={item.quantity}
                                        onChange={(val) =>
                                            handleItemChange(
                                                index,
                                                "quantity",
                                                val,
                                            )
                                        }
                                        max={maxQuantity}
                                        unit={selectedProduct?.unit}
                                    />
                                </div>
                                <div className="sales-item-price-group">
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "var(--text-muted)",
                                            marginBottom: "8px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        Unit Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.price}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "price",
                                                parseFloat(e.target.value) || 0,
                                            )
                                        }
                                        required
                                        style={{
                                            borderRadius: "10px",
                                            fontWeight: 700,
                                        }}
                                    />
                                </div>
                                <div className="sales-item-total-group">
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        Total
                                    </label>
                                    <div
                                        style={{
                                            fontSize: "1.1rem",
                                            fontWeight: 800,
                                            color: "var(--text-main)",
                                        }}
                                    >
                                        ₹
                                        {(
                                            item.quantity * item.price
                                        ).toLocaleString()}
                                    </div>
                                </div>
                                <div className="sales-item-remove">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        style={{
                                            background: "var(--danger-bg)",
                                            border: "none",
                                            color: "var(--danger)",
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "1.25rem",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseOver={(e) =>
                                            (e.currentTarget.style.transform =
                                                "scale(1.05)")
                                        }
                                        onMouseOut={(e) =>
                                            (e.currentTarget.style.transform =
                                                "scale(1)")
                                        }
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleAddItem}
                        style={{
                            marginTop: "0.5rem",
                            width: "100%",
                            borderStyle: "dashed",
                            borderRadius: "12px",
                            fontWeight: 700,
                            padding: "1rem",
                            fontSize: "0.95rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                        }}
                    >
                        + Add Another Item
                    </button>
                </div>

                <div
                    style={{
                        borderTop: "2px solid var(--border)",
                        marginTop: "2.5rem",
                        paddingTop: "2rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "var(--text-muted)",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                marginBottom: "4px",
                            }}
                        >
                            Daily Total
                        </div>
                        <div
                            style={{
                                fontSize: "2.25rem",
                                fontWeight: 900,
                                color: "var(--primary)",
                            }}
                        >
                            ₹{totalReportAmount.toLocaleString()}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                        style={{
                            padding: "1rem 3rem",
                            fontSize: "1.1rem",
                            borderRadius: "16px",
                            fontWeight: 800,
                            boxShadow:
                                "0 10px 15px -3px rgba(79, 70, 229, 0.4)",
                        }}
                    >
                        {submitting ? "Submitting..." : "Submit Daily Report"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DailySalesReport;
