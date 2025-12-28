import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            // Backend returns: { id, name, email, token, ... }
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            setUser(userData);
            setIsAuthenticated(true);

            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            let payload = userData;
            let headers = {};

            if (!(userData instanceof FormData)) {
                // Handle simple registration with basic fields
                payload = {
                    name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                    email: userData.email,
                    password: userData.password,
                    phone: userData.phone || null,
                    location: userData.location || null
                };
            } else {
                headers = { 'Content-Type': 'multipart/form-data' };
            }

            const response = await api.post('/users/register', payload, { headers });
            const { token, ...newUserData } = response.data;

            localStorage.setItem('token', token);
            setUser(newUserData);
            setIsAuthenticated(true);

            return newUserData;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
