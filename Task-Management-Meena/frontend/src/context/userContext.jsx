import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance.js';
import { AUTH } from '../utils/apiPath.js';

// Create context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user data from API
    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(AUTH.PROFILE);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Update user state
    const updateUser = (updatedData) => {
        setUser((prev) => ({
            ...prev,
            ...updatedData
        }));
    };

    // Clear user data (e.g., on logout)
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    // On mount, check if token exists and fetch user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};
