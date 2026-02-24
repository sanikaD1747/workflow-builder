import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Assuming token payload has userId or email. Just setting basic user details for UI.
                setUser({ id: decoded.userId, token });
            } catch (err) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        setUser({ ...userData, token });
    };

    const register = async (email, password) => {
        const res = await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        setUser({ ...userData, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
