import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [mode, setMode] = useState("single"); // "single" or "bulk"
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        description: "",
        price: "",
        stock: 0,
        unit: "pcs",
        category: "",
        image: "",
    });
    const [bulkState, setBulkState] = useState({
        file: null,
        uploading: false,
        logs: [],
        progress: 0,
    });

    const navigate = useNavigate();

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/products", formData);
            navigate("/products");
        } catch (err) {
            alert("Error adding product");
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length) {
            setBulkState({ ...bulkState, file: e.target.files[0], logs: [] });
        }
    };

    const parseCSV = (text) => {
        const lines = text.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const obj = {};
            const currentline = lines[i].split(","); // Simple split/limitations apply

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j] ? currentline[j].trim() : "";
            }
            result.push(obj);
        }
        return result;
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        if (!bulkState.file) return;

        setBulkState((prev) => ({
            ...prev,
            uploading: true,
            logs: [],
            progress: 0,
        }));

        const reader = new FileReader();
        reader.onload = async ({ target }) => {
            const csv = target.result;
            const parsedData = parseCSV(csv);
            const total = parsedData.length;
            const logs = [];
            let successCount = 0;

            for (let i = 0; i < total; i++) {
                const product = parsedData[i];
                try {
                    // Basic validation/transformation if needed
                    if (!product.name || !product.price) {
                        throw new Error(
                            `Missing required fields for ${
                                product.name || "row " + (i + 1)
                            }`
                        );
                    }

                    await api.post("/products", {
                        ...product,
                        stock: Number(product.stock) || 0,
                        price: Number(product.price) || 0,
                    });

                    logs.push(`✅ Added: ${product.name}`);
                    successCount++;
                } catch (err) {
                    console.error(err);
                    logs.push(
                        `❌ Failed: ${product.name || "Row " + (i + 1)} - ${
                            err.message || "Error"
                        }`
                    );
                }
                setBulkState((prev) => ({
                    ...prev,
                    progress: Math.round(((i + 1) / total) * 100),
                    logs: [...logs], // update logs in real-time
                }));
            }

            setBulkState((prev) => ({ ...prev, uploading: false }));
            if (successCount === total) {
                setTimeout(() => navigate("/products"), 2000);
            }
        };
        reader.readAsText(bulkState.file);
    };

    return (
        <div className="container" style={{ maxWidth: "800px" }}>
            <div className="card">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            margin: 0,
                        }}
                    >
                        {mode === "single"
                            ? "Add New Product"
                            : "Bulk Upload Products"}
                    </h2>
                    <div>
                        <button
                            className={`btn ${
                                mode === "single"
                                    ? "btn-primary"
                                    : "btn-outline"
                            }`}
                            onClick={() => setMode("single")}
                            style={{ marginRight: "0.5rem" }}
                        >
                            Single
                        </button>
                        <button
                            className={`btn ${
                                mode === "bulk" ? "btn-primary" : "btn-outline"
                            }`}
                            onClick={() => setMode("bulk")}
                        >
                            Bulk CSV
                        </button>
                    </div>
                </div>

                {mode === "single" ? (
                    <form onSubmit={onSubmit}>
                        <div className="form-grid two-col">
                            <div className="input-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    required
                                    placeholder="e.g. Premium Widget"
                                    className="form-input"
                                />
                            </div>
                            <div className="input-group">
                                <label>SKU (Stock Keeping Unit)</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={onChange}
                                    required
                                    placeholder="WID-001"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-grid three-col">
                            <div className="input-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={onChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="input-group">
                                <label>Initial Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock || 0}
                                    onChange={onChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="input-group">
                                <label>Unit Type</label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={onChange}
                                    className="form-input"
                                >
                                    <option value="pcs">Pieces</option>
                                    <option value="kg">Kilograms (kg)</option>
                                    <option value="box">Box/Carton</option>
                                    <option value="ltr">Liters</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={onChange}
                                placeholder="e.g. Electronics, raw materials"
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <label>Product Image URL</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={onChange}
                                placeholder="https://example.com/product.jpg"
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={onChange}
                                rows="4"
                                placeholder="Detailed product description..."
                                className="form-input"
                            />
                        </div>

                        <div style={{ marginTop: "1.5rem" }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ padding: "0.75rem 2rem" }}
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bulk-upload-section">
                        <div className="input-group">
                            <label>Upload CSV File</label>
                            <div
                                style={{
                                    border: "2px dashed #ccc",
                                    padding: "2rem",
                                    textAlign: "center",
                                    borderRadius: "8px",
                                }}
                            >
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    style={{
                                        display: "block",
                                        margin: "0 auto 1rem",
                                    }}
                                />
                                <p
                                    style={{
                                        fontSize: "0.9rem",
                                        color: "white",
                                    }}
                                >
                                    Expected headers:{" "}
                                    <code>
                                        name,sku,price,stock,unit,category,image,description
                                    </code>
                                </p>
                            </div>
                        </div>

                        {bulkState.file && (
                            <div style={{ marginTop: "1rem" }}>
                                <button
                                    onClick={handleBulkSubmit}
                                    disabled={bulkState.uploading}
                                    className="btn btn-primary"
                                    style={{ width: "100%" }}
                                >
                                    {bulkState.uploading
                                        ? `Uploading... ${bulkState.progress}%`
                                        : "Start Upload"}
                                </button>
                            </div>
                        )}

                        {bulkState.logs.length > 0 && (
                            <div
                                style={{
                                    marginTop: "1.5rem",
                                    background: "#f8f9fa",
                                    padding: "1rem",
                                    borderRadius: "8px",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                }}
                            >
                                <h4>Upload Logs</h4>
                                <ul
                                    style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: 0,
                                    }}
                                >
                                    {bulkState.logs.map((log, idx) => (
                                        <li
                                            key={idx}
                                            style={{
                                                padding: "0.25rem 0",
                                                fontSize: "0.9rem",
                                                borderBottom: "1px solid #eee",
                                            }}
                                        >
                                            {log}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddProduct;
