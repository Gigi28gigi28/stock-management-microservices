// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const accessToken = localStorage.getItem('accessToken');

                if (storedUser && accessToken) {
                    // Parse stored user
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);

                    // Verify token is still valid
                    try {
                        const response = await authAPI.verifyToken();
                        if (response.data.valid) {
                            // Update user data from server
                            setUser(response.data.user);
                        }
                    } catch (error) {
                        console.error('Token verification failed:', error);
                        // Token invalid, clear auth state
                        logout();
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { accessToken, refreshToken, user: userData } = response.data;

            // Store tokens and user data
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update state
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            return {
                success: true,
                message: response.data.message || 'Registration successful! Please verify your email.',
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            // Clear state
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Update user profile
    const updateProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            const updatedUser = response.data.user;

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return { success: true, user: updatedUser };
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update profile',
            };
        }
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Check if user is admin
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    // Check if email is verified
    const isEmailVerified = () => {
        return user?.emailVerified === true;
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        hasRole,
        isAdmin,
        isEmailVerified,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;