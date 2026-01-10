import React, { useState, useEffect } from "react";
import api from "../services/api";

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchEmployees = async () => {
        try {
            const res = await api.get("/auth/employees");
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/auth/add-employee", formData);
            alert("Employee added successfully!");
            setFormData({ name: "", email: "", password: "" });
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to add employee");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: "4rem", textAlign: "center" }}>Loading Employees...</div>;

    return (
        <div className="container">
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Employee Management</h1>
                <p style={{ color: "var(--text-muted)" }}>Add and manage company employees who can manage products and orders.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
                {/* Add Employee Form */}
                <div className="metric-card" style={{ padding: "1.5rem", alignSelf: "start" }}>
                    <h3 style={{ marginBottom: "1.5rem" }}>Add New Employee</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Full Name"
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="employee@company.com"
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                                placeholder="Min 6 characters"
                                style={{ width: "100%" }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
                            {submitting ? "Adding..." : "Add Employee"}
                        </button>
                    </form>
                </div>

                {/* Employees List */}
                <div>
                    <h3 style={{ marginBottom: "1rem" }}>Current Employees</h3>
                    <div className="table-container">
                        <table className="responsive-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Date Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp._id}>
                                        <td><strong>{emp.name}</strong></td>
                                        <td>{emp.email}</td>
                                        <td>
                                            <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", background: "var(--surface-alt)", borderRadius: "4px" }}>
                                                Employee
                                            </span>
                                        </td>
                                        <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                                            No employees found. Add one to get started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeManagement;
