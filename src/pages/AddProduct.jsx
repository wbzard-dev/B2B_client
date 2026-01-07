import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
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

    return (
        <div className="container" style={{ maxWidth: "800px" }}>
            <div className="card">
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        marginBottom: "1.5rem",
                    }}
                >
                    Add New Product
                </h2>
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
            </div>
        </div>
    );
};

export default AddProduct;
