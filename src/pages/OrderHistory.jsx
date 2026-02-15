import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(
                res.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                ),
            );
        } catch (err) {
            console.error("Error fetching orders", err);
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
            alert("Update failed");
        }
    };

    const handlePayment = async (id) => {
        if (!window.confirm("Simulate payment for this order?")) return;
        try {
            await api.put(`/orders/${id}/pay`);
            alert("Payment Submitted for Verification!");
            fetchOrders();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || "Payment Failed";
            alert(`Payment Failed: ${msg}`);
        }
    };

    const verifyPayment = async (id) => {
        try {
            await api.put(`/orders/${id}/verify-payment`);
            alert("Payment Verified!");
            fetchOrders();
        } catch (err) {
            alert("Verification Failed");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Pending":
                return "badge-warning";
            case "Confirmed":
                return "badge-info";
            case "Shipped":
                return "badge-info";
            case "Delivered":
                return "badge-success";
            case "Canceled":
                return "badge-danger";
            default:
                return "";
        }
    };

    const getPaymentBadge = (status) => {
        if (status === "Paid") return { bg: "#dcfce7", color: "#166534" }; // Green
        if (status === "Verification Pending")
            return { bg: "#fef9c3", color: "#854d0e" }; // Yellow
        return { bg: "#fee2e2", color: "#991b1b" }; // Red
    };

    const generateReceipt = (order) => {
        const doc = new jsPDF();
        const primaryColor = [79, 70, 229]; // Indigo
        const accentColor = [243, 244, 246]; // Light Gray

        // --- Header Section ---
        // Company Brand
        doc.setFontSize(26);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text("B2B Platform", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text("123 Business Road, Tech City", 14, 28);
        doc.text("support@b2bplatform.com", 14, 33);

        // Invoice Label & Details (Right Aligned)
        doc.setFontSize(26);
        doc.setTextColor(180);
        doc.text("RECEIPT", 140, 22);

        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text(
            `Order ID: #${order._id
                .substring(order._id.length - 6)
                .toUpperCase()}`,
            140,
            30,
        );
        doc.text(
            `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
            140,
            35,
        );

        // Status Badges (Text equivalent)
        doc.setFillColor(
            ...(order.paymentStatus === "Paid"
                ? [220, 252, 231]
                : [254, 249, 195]),
        );
        doc.rect(140, 39, 45, 7, "F");
        doc.setTextColor(
            ...(order.paymentStatus === "Paid" ? [22, 101, 52] : [133, 77, 14]),
        );
        doc.setFontSize(9);
        doc.text(`Payment: ${order.paymentStatus}`, 142, 43.5);

        // --- Bill To Section ---
        doc.setDrawColor(220);
        doc.line(14, 50, 196, 50);

        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To:", 14, 60);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);
        if (user.entityType === "Company" && order.distributorId) {
            doc.text(order.distributorId.name || "Distributor Name", 14, 66);
        } else {
            doc.text(user.name || "Valued Customer", 14, 66);
        }

        let yPos = 71;
        if (order.shopName) {
            doc.text(`Shop: ${order.shopName}`, 14, yPos);
            yPos += 5;
        }

        doc.text(`Status: ${order.status}`, 14, yPos);

        // --- Items Table ---
        const tableColumn = ["Item Description", "Qty", "Unit Price", "Total"];
        const tableRows = [];

        if (order.items && order.items.length > 0) {
            order.items.forEach((item) => {
                const itemData = [
                    item.name || "Product",
                    item.quantity,
                    `Rs. ${item.price.toLocaleString()}`,
                    `Rs. ${(item.quantity * item.price).toLocaleString()}`,
                ];
                tableRows.push(itemData);
            });
        }

        autoTable(doc, {
            startY: 80,
            head: [tableColumn],
            body: tableRows,
            theme: "striped",
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontStyle: "bold",
                halign: "center",
            },
            columnStyles: {
                0: { cellWidth: 80 }, // Description
                1: { halign: "center" }, // Qty
                2: { halign: "right" }, // Price
                3: { halign: "right", fontStyle: "bold" }, // Total
            },
            styles: {
                cellPadding: 3,
                fontSize: 10,
                valign: "middle",
                lineColor: [230, 230, 230],
                lineWidth: 0.1,
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251],
            },
        });

        // --- Totals Section ---
        const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 90) + 10;

        // Total Box Background
        doc.setFillColor(...accentColor);
        doc.rect(120, finalY - 5, 76, 25, "F");

        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", 125, finalY + 2);
        doc.text(`Rs. ${order.totalAmount.toLocaleString()}`, 190, finalY + 2, {
            align: "right",
        });

        doc.text("Tax (0%):", 125, finalY + 7);
        doc.text("Rs. 0", 190, finalY + 7, { align: "right" });

        doc.setFontSize(12);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text("Total:", 125, finalY + 15);
        doc.text(
            `Rs. ${order.totalAmount.toLocaleString()}`,
            190,
            finalY + 15,
            { align: "right" },
        );

        // --- Footer ---
        const pageHeight = doc.internal.pageSize.height;

        doc.setDrawColor(220);
        doc.line(14, pageHeight - 30, 196, pageHeight - 30);

        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text("Thank you for your business!", 105, pageHeight - 20, {
            align: "center",
        });
        doc.text(
            "For questions, contact support@b2bplatform.com or call +1-234-567-8900",
            105,
            pageHeight - 15,
            { align: "center" },
        );

        doc.save(`Receipt_${order._id}.pdf`);
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.875rem", fontWeight: 700 }}>
                    Order History
                </h2>
                <p style={{ color: "var(--text-muted)" }}>
                    Track past and current orders
                </p>
            </div>

            <div className="table-container">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            {user.entityType === "Company" && (
                                <th>Distributor</th>
                            )}
                            <th>Payment Due</th>
                            <th>Total Amount</th>
                            <th>Order Status</th>
                            <th>Payment Status</th>
                            <th>Receipt</th>
                            {user.entityType === "Company" ? (
                                <th>Verification</th>
                            ) : (
                                <th>Payment</th>
                            )}
                            {/* Extra Actions Column for Order Status (Company) */}
                            {user.entityType === "Company" && (
                                <th>Ship/Deliver</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const pStyle = getPaymentBadge(order.paymentStatus);
                            return (
                                <tr key={order._id}>
                                    <td data-label="Order ID">
                                        <span
                                            style={{
                                                fontFamily: "monospace",
                                                fontWeight: 600,
                                            }}
                                        >
                                            #
                                            {order._id
                                                .substring(order._id.length - 6)
                                                .toUpperCase()}
                                        </span>
                                    </td>
                                    <td data-label="Date">
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString()}
                                    </td>
                                    {user.entityType === "Company" && (
                                        <td data-label="Distributor">
                                            {order.distributorId?.name || "N/A"}
                                        </td>
                                    )}
                                    <td data-label="Payment Due">
                                        {order.paymentDueDate ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "0.9rem",
                                                    }}
                                                >
                                                    {new Date(
                                                        order.paymentDueDate,
                                                    ).toLocaleDateString()}
                                                </span>
                                                {new Date() >
                                                    new Date(
                                                        order.paymentDueDate,
                                                    ) &&
                                                    order.paymentStatus !==
                                                        "Paid" && (
                                                        <span
                                                            style={{
                                                                color: "var(--danger)",
                                                                fontSize:
                                                                    "0.75rem",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Overdue
                                                        </span>
                                                    )}
                                            </div>
                                        ) : (
                                            <span
                                                style={{
                                                    color: "var(--text-muted)",
                                                }}
                                            >
                                                -
                                            </span>
                                        )}
                                    </td>
                                    <td
                                        data-label="Total Amount"
                                        style={{ fontWeight: 600 }}
                                    >
                                        ₹{order.totalAmount}
                                    </td>
                                    <td data-label="Order Status">
                                        <span
                                            className={`badge ${getStatusBadge(
                                                order.status,
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td data-label="Payment Status">
                                        <span
                                            style={{
                                                padding: "0.25rem 0.5rem",
                                                borderRadius: "4px",
                                                background: pStyle.bg,
                                                color: pStyle.color,
                                                fontWeight: 600,
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {order.paymentStatus || "Pending"}
                                        </span>
                                    </td>

                                    <td data-label="Receipt">
                                        <button
                                            onClick={() =>
                                                generateReceipt(order)
                                            }
                                            className="btn"
                                            style={{
                                                padding: "0.25rem 0.5rem",
                                                background: "transparent",
                                                color: "var(--primary)",
                                                border: "1px solid var(--primary)",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            Download
                                        </button>
                                    </td>
                                    {user.entityType === "Company" && (
                                        <>
                                            <td data-label="Verification">
                                                {order.paymentStatus ===
                                                    "Verification Pending" && (
                                                    <button
                                                        onClick={() =>
                                                            verifyPayment(
                                                                order._id,
                                                            )
                                                        }
                                                        className="btn btn-success"
                                                        style={{
                                                            padding:
                                                                "0.25rem 0.5rem",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    >
                                                        Verify Received
                                                    </button>
                                                )}
                                                {order.paymentStatus ===
                                                    "Pending" && (
                                                    <span
                                                        style={{
                                                            fontSize: "0.8rem",
                                                            color: "var(--text-muted)",
                                                        }}
                                                    >
                                                        Waiting
                                                    </span>
                                                )}
                                                {order.paymentStatus ===
                                                    "Paid" && (
                                                    <span
                                                        style={{
                                                            fontSize: "0.8rem",
                                                            color: "var(--success)",
                                                        }}
                                                    >
                                                        ✓ Verified
                                                    </span>
                                                )}
                                            </td>
                                            <td data-label="Ship/Deliver">
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "0.5rem",
                                                    }}
                                                >
                                                    {order.status ===
                                                        "Pending" && (
                                                        <button
                                                            onClick={() =>
                                                                updateStatus(
                                                                    order._id,
                                                                    "Confirmed",
                                                                )
                                                            }
                                                            className="btn btn-warning"
                                                            style={{
                                                                padding:
                                                                    "0.25rem 0.5rem",
                                                                fontSize:
                                                                    "0.75rem",
                                                                backgroundColor:
                                                                    "#f59e0b",
                                                                color: "white",
                                                                border: "none",
                                                            }}
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                    {order.status ===
                                                        "Confirmed" && (
                                                        <button
                                                            onClick={() =>
                                                                updateStatus(
                                                                    order._id,
                                                                    "Shipped",
                                                                )
                                                            }
                                                            className="btn btn-primary"
                                                            style={{
                                                                padding:
                                                                    "0.25rem 0.5rem",
                                                                fontSize:
                                                                    "0.75rem",
                                                            }}
                                                        >
                                                            Ship
                                                        </button>
                                                    )}
                                                    {order.status ===
                                                        "Shipped" && (
                                                        <button
                                                            onClick={() =>
                                                                updateStatus(
                                                                    order._id,
                                                                    "Delivered",
                                                                )
                                                            }
                                                            className="btn btn-success"
                                                            style={{
                                                                padding:
                                                                    "0.25rem 0.5rem",
                                                                fontSize:
                                                                    "0.75rem",
                                                            }}
                                                        >
                                                            Deliver
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    )}

                                    {user.entityType === "Distributor" && (
                                        <td data-label="Payment">
                                            {order.paymentStatus !== "Paid" &&
                                                order.paymentStatus !==
                                                    "Verification Pending" &&
                                                order.status !== "Canceled" && (
                                                    <button
                                                        onClick={() =>
                                                            handlePayment(
                                                                order._id,
                                                            )
                                                        }
                                                        className="btn btn-primary"
                                                        style={{
                                                            padding:
                                                                "0.25rem 0.75rem",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    >
                                                        Pay Now
                                                    </button>
                                                )}
                                            {order.paymentStatus ===
                                                "Verification Pending" && (
                                                <span
                                                    style={{
                                                        fontSize: "0.8rem",
                                                        color: "#854d0e",
                                                    }}
                                                >
                                                    Processing...
                                                </span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        {orders.length === 0 && (
                            <tr>
                                <td
                                    colSpan="7"
                                    style={{
                                        padding: "2rem",
                                        textAlign: "center",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistory;
