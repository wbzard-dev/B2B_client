import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import RegisterCompany from "./pages/RegisterCompany";
import RegisterDistributor from "./pages/RegisterDistributor";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import OrderHistory from "./pages/OrderHistory";
import Dashboard from "./pages/Dashboard";
import DistributorList from "./pages/DistributorList";
import InventoryTracking from "./pages/InventoryTracking";
import DailySalesReport from "./pages/DailySalesReport";
import CompanyAnalytics from "./pages/CompanyAnalytics";
import EmployeeManagement from "./pages/EmployeeManagement";
import Profile from "./pages/Profile";
import ShopOnboarding from "./pages/ShopOnboarding";
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
                        <Route
                            path="/inventory"
                            element={<InventoryTracking />}
                        />
                        <Route
                            path="/sales-report"
                            element={<DailySalesReport />}
                        />
                        <Route
                            path="/shop-onboarding"
                            element={<ShopOnboarding />}
                        />
                        <Route
                            path="/analytics"
                            element={<CompanyAnalytics />}
                        />
                        <Route
                            path="/employees"
                            element={<EmployeeManagement />}
                        />
                        <Route path="/profile" element={<Profile />} />
                        <Route
                            path="/distributor-dashboard"
                            element={<Navigate to="/" replace />}
                        />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
