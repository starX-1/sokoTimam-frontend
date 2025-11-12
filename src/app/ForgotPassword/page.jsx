'use client'
import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Users from '../api/user/api'
import { toast } from 'react-toastify';

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
const Logo = ({ color = '#985942' }) => (
    <div className="flex flex-col items-center">
        <img src="/soko.png" alt="" className='object-cover' width={80} height={80} />
    </div>
);

// --- Main Forgot Password Component ---
const ForgotPassword = ({ onViewChange, onBackToLogin }) => {
    const [step, setStep] = useState(1); // 1: Email verification, 2: OTP verification, 3: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const router = useRouter();

    // Step 1: Handle email submission
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            alert('Please enter your email address.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            // Simulate API call to send reset link/OTP
            await Users.forgetPassword(email);
            toast.success('Reset link sent successfully', {
                position: "top-center",
                autoClose: 5000,
            });
            setVerifiedEmail(email);
            setStep(2);
            setLoading(false);
        } catch (error) {
            alert('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    // Step 2: Handle OTP verification
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 4) {
            toast.error('Please enter a 4-digit code.');
            return;
        }

        setLoading(true);
        try {
            // Simulate API call to verify OTP
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('Email verified! Redirecting you to reset your password.');
            setStep(3);
            setLoading(false);
        } catch (error) {
            alert('Invalid code. Please try again.');
            setLoading(false);
        }
    };

    // Handle back button
    const handleBack = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            {/* Container */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform">

                {/* Top Section: Logo */}
                <div className="p-8 pb-0 flex flex-col items-center">
                    <div className="mb-6">
                        <Logo />
                    </div>
                </div>

                {/* Pattern Divider */}
                <PatternDivider />

                {/* Form Content */}
                <div className="p-8 pt-10">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition duration-150 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    {/* Step 1: Email Entry */}
                    {step === 1 && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                            <p className="text-gray-600 text-sm mb-8">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <div>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-inner focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
                                        required
                                    />
                                </div>

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
                                        Sending...
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleEmailSubmit}
                                        className="w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#864c37] transition duration-200"
                                    >
                                        Send Reset Link
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Code</h2>
                            <p className="text-gray-600 text-sm mb-2">
                                We've sent a verification code to
                            </p>
                            <p className="text-orange-600 font-medium text-sm mb-8">
                                {verifiedEmail}
                            </p>

                            <div>
                                <div className="mb-6">
                                    <label htmlFor="otp" className="block text-xs font-medium text-gray-500 mb-2">
                                        Verification Code
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 4-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-orange-600 transition duration-150 text-gray-800 placeholder-gray-400 text-center tracking-widest text-2xl"
                                        maxLength="4"
                                        required
                                    />
                                </div>

                                <p className="text-gray-600 text-xs mb-6">
                                    Didn't receive the code?{' '}
                                    <button type="button" className="text-orange-600 font-medium hover:underline">
                                        Resend
                                    </button>
                                </p>

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
                                        Verifying...
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleOtpSubmit}
                                        className="w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#864c37] transition duration-200"
                                    >
                                        Verify Code
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step 3: Success Message */}
                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="mb-6 flex justify-center">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                                Email Verified!
                            </h2>
                            <p className="text-gray-600 text-sm text-center mb-8">
                                Your email has been verified. You can now reset your password on the next screen.
                            </p>
                            <button
                                onClick={()=>router.push('/resetPassword')}
                                className="w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#864c37] transition duration-200"
                            >
                                Continue to Reset Password
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

export default ForgotPassword;