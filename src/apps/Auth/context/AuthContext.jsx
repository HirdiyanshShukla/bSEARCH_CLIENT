import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check authentication status on mount
useEffect(() => {
    if (!isAuthenticated) {
        checkAuthStatus();
    }
}, []);

    
const resetSession = () => {
    setUser(null);
    setIsAuthenticated(false);
};


const checkAuthStatus = async () => {
    if (isAuthenticated) return user;

    try {
        const response = await authService.checkAuth();
        const userData = response.user;

        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);

        return userData;
    } catch {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return null;
    }
};



const login = async (email, password) => {
    const response = await authService.login(email, password);
    const me = await checkAuthStatus();
    return me;
};


    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuthStatus,
        resetSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
