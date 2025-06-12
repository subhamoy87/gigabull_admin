import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check localStorage for authentication status on component mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;