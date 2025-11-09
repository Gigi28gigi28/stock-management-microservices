// pages/public/VerifyEmailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';

export const VerifyEmailPage = () => {
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await authAPI.verifyEmail(token);

                if (response.data.success) {
                    setStatus('success');
                    setMessage(response.data.message || 'Your email has been successfully verified.');

                    // Auto-redirect to login after 3 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Email verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage(
                    err.response?.data?.message ||
                    'The verification link is invalid or has expired.'
                );
                console.error('Email verification error:', err);
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage('Invalid verification link.');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
                    {status === 'loading' && (
                        <>
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
                            <p className="text-gray-600">Please wait while we verify your email address...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
                            <p className="text-gray-600 mb-6">
                                {message}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Redirecting to login in 3 seconds...
                            </p>
                            <Link
                                to="/login"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Go to Login Now
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                                <XCircle className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                            <p className="text-gray-600 mb-6">
                                {message}
                            </p>
                            <div className="space-y-3">
                                <Link
                                    to="/register"
                                    className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Register Again
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;