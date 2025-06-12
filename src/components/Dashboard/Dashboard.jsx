// src/components/Dashboard/Dashboard.jsx
import React from 'react'; // Remove useContext, no need to get logout here
import { Link } from 'react-router-dom';
// import { AuthContext } from '../Auth/AuthContext'; // Remove this import as well if not used

import './Dashboard.css';

const Dashboard = () => {
    // const { logout } = useContext(AuthContext); // Remove this line

    return (
        <div className="dashboard-container">
            {/* REMOVED: <button onClick={logout} className="dashboard-logout-button">Logout</button> */}
            <div className="dashboard-header">
                <h1>Welcome to the Admin Dashboard!</h1>
                {/* <p>Please select an option below to proceed:</p> */}
            </div>
            <div className="dashboard-options">
                <Link to="/proforma-invoice" className="dashboard-card">
                    <div className="dashboard-card-icon">📄</div>
                    <h2>Proforma Invoice</h2>
                    <p>Generate and manage proforma invoices for your clients.</p>
                </Link>
                <Link to="/purchase-order" className="dashboard-card">
                    <div className="dashboard-card-icon">🛒</div>
                    <h2>Purchase Order</h2>
                    <p>Create and track purchase orders for your suppliers.</p>
                </Link>
                <Link to="/export-invoice" className="dashboard-card">
                    <div className="dashboard-card-icon">✈️</div>
                    <h2>Export Invoice</h2>
                    <p>Handle comprehensive invoices for international exports.</p>
                </Link>
                <Link to="/local-invoice" className="dashboard-card">
                    <div className="dashboard-card-icon">🏠</div>
                    <h2>Local Invoice</h2>
                    <p>Generate detailed invoices for domestic sales and services.</p>
                </Link>
                <Link to="/packing-list" className="dashboard-card">
                    <div className="dashboard-card-icon">📦</div>
                    <h2>Packing List</h2>
                    <p>Prepare and manage packing lists for effective shipment organization.</p>
                </Link>
                <Link to="/product-list" className="dashboard-card">
                    <div className="dashboard-card-icon">📦</div>
                    <h2>Add/Edit Products</h2>
                    <p>Add and manage products lists for effective product management.</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;