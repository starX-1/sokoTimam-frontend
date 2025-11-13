'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Lock, EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import sellers from '../api/seller/api'
import Link from 'next/link';

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
        <img src="/soko.png" alt="" className='object-cover' width={100} height={100} />
    </div>
);

// --- Input Field Component ---
const LoginInputGroup = ({ icon: Icon, type, placeholder, name, onChange }) => (
    <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Icon className="w-5 h-5" />
        </div>
        <input
            type={type}
            placeholder={placeholder}
            name={name}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-inner focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
            required
        />
    </div>
);

// --- Helper function to redirect user based on role ---
const redirectUserByRole = async (session, router) => {
    if (!session?.user) return;
    
    const userRole = session.user.role;
    console.log("Redirecting user with role:", userRole);

    if (userRole === "admin") {
        router.push("/adminDashboard");
    } else if (userRole === "seller") {
        try {
            const sellerData = await sellers.getSellerByUserId(session.user.id);
            sessionStorage.setItem("sellerData", JSON.stringify(sellerData.data));
            router.push("/sellerDashboard");
        } catch (err) {
            console.error("Error fetching seller data:", err);
            router.push("/sellerDashboard");
        }
    } else if (userRole === "customer") {
        router.push("/");
    } else {
        router.push("/");
    }
};

// --- Login Page Component ---
const LoginPage = ({ onViewChange }) => {
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    // ✅ Check if user is already logged in and redirect
    useEffect(() => {
        const checkExistingSession = async () => {
            const session = await getSession();
            if (session?.user) {
                console.log("User already logged in, redirecting...", session.user);
                await redirectUserByRole(session, router);
            }
        };
        checkExistingSession();
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await signIn("credentials", {
                redirect: false,
                email: loginData.email,
                password: loginData.password,
            });

            console.log("Sign in response:", response);

            if (!response?.ok || response?.error) {
                toast.error("Invalid email or password");
                setLoading(false);
                return;
            }

            // Wait for session to update
            await new Promise(resolve => setTimeout(resolve, 800));

            const session = await getSession();
            console.log("Session after credentials login:", session);

            if (!session?.user) {
                toast.error("Failed to retrieve user session");
                setLoading(false);
                return;
            }

            await redirectUserByRole(session, router);
            setLoading(false);
        } catch (error) {
            toast.error("Something went wrong");
            // console.error("Login error:", error);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const response = await signIn("google", { redirect: false });
            console.log("Google sign in response:", response);

            if (response?.error) {
                toast.error("Google sign in failed");
                setLoading(false);
                return;
            }

            // Wait for session to update
            await new Promise(resolve => setTimeout(resolve, 1000));

            const session = await getSession();
            console.log("Session after Google login:", session);

            if (!session?.user) {
                toast.error("Failed to retrieve session after Google login");
                setLoading(false);
                return;
            }

            await redirectUserByRole(session, router);
            setLoading(false);
        } catch (error) {
            toast.error("Something went wrong with Google sign in");
            console.error("Google sign in error:", error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform">
                <div className="p-8 pb-0 flex flex-col items-center">
                    <div className="mb-6">
                        <Logo />
                    </div>
                </div>

                <PatternDivider />

                <form onSubmit={handleSignIn} className="p-8 pt-10">
                    <LoginInputGroup icon={Mail} type="email" placeholder="Email" name="email" onChange={handleInputChange} />
                    
                    <div className="relative mb-6">
                        <LoginInputGroup
                            icon={Lock}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                        />

                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 cursor-pointer">
                            {showPassword ? (
                                <button type="button" onClick={() => setShowPassword(false)}>
                                    <EyeIcon />
                                </button>
                            ) : (
                                <button type="button" onClick={() => setShowPassword(true)}>
                                    <EyeOffIcon />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end mb-8 text-sm">
                        <Link href="/ForgotPassword" className="text-gray-500 hover:text-orange-600 transition duration-150">
                            Forgot Password?
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md">
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-orange-200"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Wait...
                        </div>
                    ) : (
                        <>
                            <button
                                type="submit"
                                className="w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#864c37] transition duration-200"
                            >
                                Sign In
                            </button>

                            <div className="flex items-center justify-center my-2">
                                <span className="text-gray-400 text-sm">OR</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition duration-200 shadow-sm"
                            >
                                <img
                                    src="/google.png"
                                    alt="Google"
                                    className="w-5 h-5"
                                />
                                Continue with Google
                            </button>
                        </>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-600">
                        New to SokoTimam?{' '}
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onViewChange('signup'); }}
                            className="text-orange-600 font-medium hover:underline transition duration-150"
                        >
                            Create Account
                        </a>
                    </div>
                </form>

                <PatternDivider />

                <div className="text-center py-4 text-xs text-gray-500 bg-white">
                    &copy; 2025 Copyright. sokotimam.com
                </div>
            </div>
        </div>
    );
};

export default LoginPage;