// pages/public/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../services/api';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.forgotPassword(email);

            if (response.data.success) {
                setSent(true);
                console.log('Reset link sent! Check your email.');
            } else {
                setError(response.data.message || 'Failed to send reset link. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
            console.error('Forgot password error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    {!sent ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                                    <Mail className="h-8 w-8" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
                                <p className="text-gray-600 mt-2">
                                    No worries, we'll send you reset instructions
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                                <Mail className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                            <p className="text-gray-600 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="text-sm text-gray-500">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;