import React, { useState, useEffect } from "react";
import api from "../services/api";

const DistributorSalesCalendar = ({
    distributorId,
    distributorName,
    onClose,
}) => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDaySales, setSelectedDaySales] = useState(null);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await api.get(
                    `/distributor/company/sales/${distributorId}`,
                );
                setSales(res.data);
                console.log("Fetched Sales:", res.data);
            } catch (err) {
                console.error("Error fetching distributor sales:", err);
            } finally {
                setLoading(false);
            }
        };
        if (distributorId) fetchSales();
    }, [distributorId]);

    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) =>
        new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const getSalesForDay = (day) => {
        return sales.filter((sale) => {
            const saleDate = new Date(sale.date);
            return (
                saleDate.getDate() === day &&
                saleDate.getMonth() === month &&
                saleDate.getFullYear() === year
            );
        });
    };

    const handleDayClick = (day, daySales) => {
        if (daySales.length > 0) {
            setSelectedDaySales({ day, daySales });
        } else {
            setSelectedDaySales(null);
        }
    };

    if (loading) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                backdropFilter: "blur(8px)",
            }}
        >
            <div
                className="glass-card"
                style={{
                    width: "90%",
                    maxWidth: "600px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: "2rem",
                    position: "relative",
                    display: "block", // Override flex from glass-card if needed, but usually block is fine or flex-col
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        border: "none",
                        background: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                    }}
                >
                    ✕
                </button>

                <h2
                    style={{
                        marginBottom: "1.5rem",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        textAlign: "center",
                    }}
                >
                    Sales Report: {distributorName}
                </h2>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                    }}
                >
                    <button
                        className="btn btn-secondary glass-btn"
                        onClick={prevMonth}
                    >
                        &lt;
                    </button>
                    <h3 style={{ margin: 0, fontSize: "1.25rem" }}>
                        {monthNames[month]} {year}
                    </h3>
                    <button
                        className="btn btn-secondary glass-btn"
                        onClick={nextMonth}
                    >
                        &gt;
                    </button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: "4px",
                    }}
                >
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (d) => (
                            <div
                                key={d}
                                style={{
                                    padding: "0.5rem",
                                    textAlign: "center",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                {d}
                            </div>
                        ),
                    )}

                    {[...Array(firstDay)].map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            style={{
                                minHeight: "60px",
                                borderRadius: "var(--radius-md)",
                            }}
                        ></div>
                    ))}

                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const daySales = getSalesForDay(day);
                        const hasSales = daySales.length > 0;
                        const totalDayAmount = daySales.reduce(
                            (acc, curr) => acc + curr.totalAmount,
                            0,
                        );

                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day, daySales)}
                                style={{
                                    backgroundColor: hasSales
                                        ? "rgba(74, 222, 128, 0.1)"
                                        : "rgba(255, 255, 255, 0.03)",
                                    minHeight: "60px",
                                    padding: "0.5rem",
                                    borderRadius: "var(--radius-md)",
                                    cursor: hasSales ? "pointer" : "default",
                                    border:
                                        selectedDaySales?.day === day
                                            ? "2px solid var(--primary)"
                                            : "1px solid transparent",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    color: "var(--text-main)",
                                    transition: "all 0.2s",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: hasSales ? 700 : 400,
                                    }}
                                >
                                    {day}
                                </span>
                                {hasSales && (
                                    <div
                                        style={{
                                            backgroundColor: "var(--success)",
                                            color: "white",
                                            fontSize: "0.65rem",
                                            padding: "2px 4px",
                                            borderRadius: "3px",
                                            textAlign: "center",
                                            marginTop: "4px",
                                        }}
                                    >
                                        ₹{totalDayAmount.toLocaleString()}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {selectedDaySales && (
                    <div
                        style={{
                            marginTop: "2rem",
                            padding: "1rem",
                            borderTop: "1px solid var(--glass-border)",
                        }}
                    >
                        <h4 style={{ marginBottom: "1rem" }}>
                            Sales for {selectedDaySales.day} {monthNames[month]}{" "}
                            {year}
                        </h4>
                        {selectedDaySales.daySales.map((sale, idx) => (
                            <div
                                key={idx}
                                style={{
                                    marginBottom: "1rem",
                                    paddingBottom: "0.5rem",
                                    borderBottom:
                                        "1px solid var(--glass-border)",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "0.875rem",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    Reported at{" "}
                                    {new Date(
                                        sale.createdAt,
                                    ).toLocaleTimeString()}
                                </div>
                                {sale.items.map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: "0.9rem",
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        <span>
                                            {item.name} x {item.quantity}
                                            {item.shopName ? (
                                                <div
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "var(--text-muted)",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    Shop: {item.shopName}
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "red",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    [Debug: No Shop Name info]
                                                </div>
                                            )}
                                        </span>
                                        <span style={{ fontWeight: 600 }}>
                                            ₹{item.total.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                                <div
                                    style={{
                                        textAlign: "right",
                                        fontWeight: 700,
                                        marginTop: "0.5rem",
                                        borderTop:
                                            "1px dashed var(--glass-border)",
                                        paddingTop: "0.25rem",
                                    }}
                                >
                                    Total: ₹{sale.totalAmount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistributorSalesCalendar;
