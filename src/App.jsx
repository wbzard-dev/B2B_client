import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import RegisterCompany from './pages/RegisterCompany';
import RegisterDistributor from './pages/RegisterDistributor';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import OrderHistory from './pages/OrderHistory';
import Dashboard from './pages/Dashboard';

import DistributorList from './pages/DistributorList';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-company" element={<RegisterCompany />} />
          <Route path="/register-distributor" element={<RegisterDistributor />} />
          <Route path="/distributors" element={<DistributorList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<AddProduct />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
