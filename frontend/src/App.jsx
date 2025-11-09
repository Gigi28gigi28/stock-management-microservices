import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// ✅ Public Pages
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import VerifyEmailPage from './pages/public/VerifyEmailPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';

/* 
// 🚧 Uncomment these when the files exist

// ✅ Protected Pages
import DashboardPage from './pages/protected/DashboardPage';
import ProfilePage from './pages/protected/ProfilePage';

// ✅ Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersListPage from './pages/admin/UsersListPage';
import UserDetailsPage from './pages/admin/UserDetailsPage';
import AddUserPage from './pages/admin/AddUserPage';
import EditUserPage from './pages/admin/EditUserPage';

// ✅ Error Pages
import UnauthorizedPage from './pages/errors/UnauthorizedPage';
import NotFoundPage from './pages/errors/NotFoundPage';
*/

// 🌀 Loading Component
const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
    </div>
);

// 🔒 Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

// 👑 Admin Route Wrapper
const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin()) return <Navigate to="/unauthorized" replace />;

    return children;
};

// 🌐 Public Route Wrapper
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return children;
};

// 🌍 Main Routes
function AppRoutes() {
    return (
        <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                }
            />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPasswordPage />
                    </PublicRoute>
                }
            />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* ================= PROTECTED ROUTES (commented for now) ================= */}
            {/*
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            */}

            {/* ================= ADMIN ROUTES (commented for now) ================= */}
            {/*
            <Route
                path="/admin/dashboard"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <AdminRoute>
                        <UsersListPage />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/users/new"
                element={
                    <AdminRoute>
                        <AddUserPage />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/users/:id"
                element={
                    <AdminRoute>
                        <UserDetailsPage />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/users/:id/edit"
                element={
                    <AdminRoute>
                        <EditUserPage />
                    </AdminRoute>
                }
            />
            */}

            {/* ================= ERROR PAGES (commented for now) ================= */}
            {/*
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            */}

            {/* ================= DEFAULT ROUTES ================= */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* When NotFoundPage exists, use it here */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    );
}

// 🌟 Root App Component
function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
