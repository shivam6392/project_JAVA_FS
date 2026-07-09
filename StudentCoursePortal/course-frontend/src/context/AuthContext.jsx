import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('course_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const { token, role, username: loggedUsername } = response.data;

        localStorage.setItem('course_token', token);
        const userData = { username: loggedUsername, role };
        localStorage.setItem('course_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const register = async (username, password, email, name) => {
        await api.post('/auth/register', { username, password, email, name });
    };

    const logout = () => {
        localStorage.removeItem('course_token');
        localStorage.removeItem('course_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
