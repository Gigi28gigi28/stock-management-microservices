import axios from 'axios';

// Base API URL - Update this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/users';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request Interceptor - Add token to every request
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.config.url}`, response.data);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (refreshToken) {
                    console.log('🔄 Attempting to refresh token...');

                    // Call refresh token endpoint
                    const response = await axios.post(
                        `${API_BASE_URL}/refresh-token`,
                        { refreshToken }
                    );

                    const { accessToken: newAccessToken } = response.data;

                    // Update stored token
                    localStorage.setItem('accessToken', newAccessToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);

                // Clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');

                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Log error details
        console.error('❌ API Error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            url: error.config?.url
        });

        return Promise.reject(error);
    }
);

// ============ AUTH API CALLS ============

export const authAPI = {
    // Register new user
    register: (userData) => api.post('/register', userData),

    // Login user
    login: (credentials) => api.post('/login', credentials),

    // Logout user
    logout: () => api.post('/logout'),

    // Verify email
    verifyEmail: (token) => api.get(`/verify-email/${token}`),

    // Forgot password
    forgotPassword: (email) => api.post('/forgot-password', { email }),

    // Reset password
    resetPassword: (token, newPassword) =>
        api.post('/reset-password', { token, newPassword }),

    // Refresh access token
    refreshToken: (refreshToken) =>
        api.post('/refresh-token', { refreshToken }),

    // Get current user profile
    getProfile: () => api.get('/profile'),

    // Verify token (for other microservices)
    verifyToken: () => api.get('/verify-token'),
};

// ============ USER MANAGEMENT API CALLS (ADMIN ONLY) ============

export const userAPI = {
    // Get all users
    getAllUsers: () => api.get('/'),

    // Get user by ID
    getUserById: (id) => api.get(`/${id}`),

    // Update user
    updateUser: (id, userData) => api.put(`/${id}`, userData),

    // Delete user
    deleteUser: (id) => api.delete(`/${id}`),
};

// ============ ADMIN API CALLS ============

export const adminAPI = {
    // Get admin dashboard data
    getDashboard: () => api.get('/admin/dashboard'),
};

// ============ HEALTH CHECK ============

export const healthCheck = () => api.get('/health');

// Export default api instance for custom calls
export default api;