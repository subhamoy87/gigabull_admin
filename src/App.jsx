import React, { useContext } from 'react';
import PurchaseOrderForm from './components/PurchaseOrder/PurchaseOrderForm';
import LocalInvoiceForm  from './components/LocalInvoice/LocalInvoiceForm';
import ProformaInvoiceForm  from './components/ProformaInvoice/ProformaInvoiceForm';
import ExportInvoiceForm  from './components/ExportInvoice/ExportInvoiceForm';
import PackingListForm  from './components/PackingList/PackingListForm';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './components/Auth/LoginPage';
import { AuthContext, AuthProvider } from './components/Auth/AuthContext';
import './App.css';

// PrivateRoute component to protect routes AND show common logout button
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, logout } = useContext(AuthContext); // Get logout from AuthContext

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            {/* Common Logout button for all protected routes */}
            <button onClick={logout} className="common-logout-button">Logout</button>
            {children} {/* Renders the protected component (Dashboard or specific form) */}
        </>
    );
};

const AppContent = () => {
    return (
        <Router>
            <Routes>                
                {/* Default redirect to Login if root is accessed */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes - All will now have the logout button from PrivateRoute */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/proforma-invoice"
                    element={
                        <PrivateRoute>
                            <ProformaInvoiceForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/purchase-order"
                    element={
                        <PrivateRoute>
                            <PurchaseOrderForm />
                        </PrivateRoute>
                    }
                />
                 <Route
                    path="/export-invoice"
                    element={
                        <PrivateRoute>
                            <ExportInvoiceForm />
                        </PrivateRoute>
                    }
                />
                 <Route
                    path="/local-invoice"
                    element={
                        <PrivateRoute>
                            <LocalInvoiceForm />
                        </PrivateRoute>
                    }
                />
                 <Route
                    path="/packing-list"
                    element={
                        <PrivateRoute>
                            <PackingListForm />
                        </PrivateRoute>
                    }
                />

                {/* Fallback for unmatched routes */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;