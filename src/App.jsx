import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import RegisterCompany from "./pages/RegisterCompany";
import RegisterDistributor from "./pages/RegisterDistributor";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import OrderHistory from "./pages/OrderHistory";
import Dashboard from "./pages/Dashboard";
import DistributorList from "./pages/DistributorList";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes - No Sidebar/Layout */}
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/register-company"
                        element={<RegisterCompany />}
                    />
                    <Route
                        path="/register-distributor"
                        element={<RegisterDistributor />}
                    />

                    {/* Protected Routes - With Sidebar/Layout */}
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route
                            path="/distributors"
                            element={<DistributorList />}
                        />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/products/new" element={<AddProduct />} />
                        <Route path="/orders" element={<OrderHistory />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
