'use client'
import React, { useEffect, useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import Users from '../api/user/api'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// --- Decorative Pattern Divider ---
const PatternDivider = () => (
    <svg
        className="w-full h-auto"
        viewBox="0 0 100 5"
        preserveAspectRatio="none"
        style={{ minHeight: '10px', maxHeight: '10px' }}
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="0" y="0" width="100" height="5" fill="#f9f7f4" />
        {[...Array(10)].map((_, i) => {
            const x = i * 10;
            return (
                <g key={i}>
                    <rect x={x} y="0" width="2.5" height="5" fill="#985942" />
                    <rect x={x + 2.5} y="0" width="2.5" height="5" fill="#000000" />
                    <rect x={x + 5} y="0" width="2.5" height="5" fill="#F97316" />
                    <rect x={x + 7.5} y="0" width="2.5" height="5" fill="#ffffff" />
                </g>
            );
        })}
    </svg>
);

// --- Logo Component ---
const Logo = () => (
    <div className="flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">S</span>
        </div>
    </div>
);

// --- Password Strength Indicator ---
const PasswordStrength = ({ password }) => {
    const getStrength = () => {
        if (!password) return { level: 0, text: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return { level: 1, text: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { level: 2, text: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 4) return { level: 3, text: 'Good', color: 'bg-blue-500' };
        return { level: 4, text: 'Strong', color: 'bg-green-500' };
    };

    const strength = getStrength();

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= strength.level ? strength.color : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
            <p className="text-xs text-gray-600">Password strength: <span className="font-medium">{strength.text}</span></p>
        </div>
    );
};

// --- Main Reset Password Component ---
const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');
    const router = useRouter()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            setToken(token);
        }
    }, []);

    const validatePassword = () => {
        const errors = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Include at least one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Include at least one uppercase letter');
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push('Include at least one number');
        }
        if (password !== confirmPassword) {
            errors.push('Passwords do not match');
        }

        return errors;
    };

    const handleSubmit = async () => {
        const errors = validatePassword();
        if (errors.length > 0) {
            toast.error(errors.join('\n'));
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            const data ={
                token:token,
                newPassword:password
            }
            const response = await Users.resetPassword(data);
            if (response.message !== "Token and new password are required") {
                toast.success('Password reset successfully!');
                setSuccess(true);
                setLoading(false);
                setTimeout(() => {
                    handleBackToLogin();
                }, 3000);
            } else {
                toast.error("Something went wrong. Please try again.");
                setLoading(false);
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        // Navigate to login - you can use router.push('/login') in actual implementation
        router.push('/login');

    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            {/* Container */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform">

                {/* Top Section: Logo */}
                {/* <div className="p-8 pb-0 flex flex-col items-center">
                    <div className="mb-6">
                        <Logo />
                    </div>
                </div> */}

                {/* Pattern Divider */}
                <PatternDivider />

                {/* Form Content */}
                <div className="p-8 pt-10">
                    {!success ? (
                        <>
                            {/* Header */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
                            <p className="text-gray-600 text-sm mb-8">
                                Create a strong password to secure your account.
                            </p>

                            <div>
                                {/* New Password Field */}
                                <div className="mb-6">
                                    <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl shadow-inner focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <PasswordStrength password={password} />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="mb-6">
                                    <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-500 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl shadow-inner focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-xs text-red-500 mt-2">Passwords do not match</p>
                                    )}
                                </div>

                                {/* Password Requirements */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            At least 8 characters
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            One uppercase letter
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            One lowercase letter
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            One number
                                        </li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                {loading ? (
                                    <div className="flex items-center justify-center w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-orange-200"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting Password...
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#864c37] transition duration-200"
                                    >
                                        Reset Password
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        // Success State
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="mb-6 flex justify-center">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                                Password Reset Successfully!
                            </h2>
                            <p className="text-gray-600 text-sm text-center mb-8">
                                Your password has been reset. You can now log in with your new password.
                            </p>
                            <button
                                onClick={handleBackToLogin}
                                className="w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#864c37] transition duration-200"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>

                {/* Pattern Divider Bottom */}
                <PatternDivider />

                {/* Footer */}
                <div className="text-center py-4 text-xs text-gray-500 bg-white">
                    &copy; 2025 Copyright. sokotimam.com
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;