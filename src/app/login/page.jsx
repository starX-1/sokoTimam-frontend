'use client'
import React, { useState } from 'react';
// Using lucide-react icons for the form fields
import { Mail, Lock, User, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import auth from '../api/auth/auth'
import { getSession, signIn } from 'next-auth/react';
// --- Decorative Pattern Divider ---
// Using an inline SVG for a crisp, repeatable geometric pattern look, 
// mimicking the design in the uploaded image's border.
const PatternDivider = () => (
    <svg
        className="w-full h-auto"
        viewBox="0 0 100 5"
        preserveAspectRatio="none"
        style={{ minHeight: '10px', maxHeight: '10px' }}
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="0" y="0" width="100" height="5" fill="#f9f7f4" /> {/* Base color, very light off-white */}
        {/* Mock pattern strips: Brown, Black, Orange, White */}
        {[...Array(10)].map((_, i) => {
            const x = i * 10;
            return (
                <g key={i}>
                    <rect x={x} y="0" width="2.5" height="5" fill="#985942" /> {/* Brown */}
                    <rect x={x + 2.5} y="0" width="2.5" height="5" fill="#000000" /> {/* Black */}
                    <rect x={x + 5} y="0" width="2.5" height="5" fill="#F97316" /> {/* Orange */}
                    <rect x={x + 7.5} y="0" width="2.5" height="5" fill="#ffffff" /> {/* White */}
                </g>
            );
        })}
    </svg>
);

// --- Logo and Branding Component ---
const Logo = ({ color = '#985942' }) => (
    <div className="flex flex-col items-center">
        <img src="/soko.png" alt="" className='object-cover' width={100} height={100} />
    </div>
);

// --- Input Field with Icon for Login Page ---
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

// --- Standard Input Field for Signup Page (bottom line style) ---
const SignupInputField = ({ label, type, name, placeholder, onChange }) => (
    <div className="mb-8">
        <label htmlFor={name} className="block text-xs font-medium text-gray-500 capitalize">
            {label}
        </label>
        <input
            id={name}
            type={type}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-orange-600 transition duration-150 text-gray-800 placeholder-gray-400"
            required
        />
        {/* Mock visual for password strength */}
        {type === 'password' && (
            <div className="mt-1">
                <span className="text-xs text-green-600">Strong Password</span>
            </div>
        )}
    </div>
);


// --- Login Page Component ---
const LoginPage = ({ onViewChange }) => {
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };



    const handleSignIn = async (e) => {
        // handle login with next-auth 
        e.preventDefault();
        console.log("Login Data:", loginData);
        setLoading(true);
        try {
            const responsse = await signIn('credentials', {
                redirect: false,
                username: loginData.email,
                password: loginData.password
            })

            if (responsse.error) {
                setErrors({ submit: 'Login failed. Please check your credentials.' });
            }
            else {
                const session = await getSession();
                // const chamaCount = session?.user?.chamaa?.message

                if (session?.user?.role === "admin") {
                    router.push('/adminDashboard')
                }
                else {
                    router.push('/dashboard')
                }

                // router.push('/dashboard')
            }
        } catch (error) {
            toast.error("something went wrong")
            console.log(error);
            setLoading(false);
        }

    };

    return (
        // Full screen container, responsive padding
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">

            {/* Login Card Container (max-w-md ensures it's centered and not too wide on desktop) */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform">

                {/* Top Section: Logo & Pattern */}
                <div className="p-8 pb-0 flex flex-col items-center">
                    <div className="mb-6">
                        <Logo />
                    </div>
                </div>

                {/* Decorative Pattern Divider Top */}
                <PatternDivider />

                {/* Form Content */}
                <form onSubmit={handleSignIn} className="p-8 pt-10">
                    <LoginInputGroup icon={Mail} type="email" placeholder="Email" name="email" onChange={handleInputChange} />
                    <LoginInputGroup icon={Lock} type="password" placeholder="Password" name="password" onChange={handleInputChange} />

                    {/* Forgot Password Link */}
                    <div className="flex justify-end mb-8 text-sm">
                        <a href="#" className="text-gray-500 hover:text-orange-600 transition duration-150">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Sign In Button (Earthy brown color: #985942) */}
                    {/* check if loading   */}
                    {loading ? (
                        <div className="flex items-center justify-center w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#864c37] transition duration-200">
                            <svg className="animate-spin h-5 w-5 mr-2 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Wait...
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-[#985942] text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#864c37] transition duration-200"
                        >
                            Sign In
                        </button>
                    )}

                    {/* Create Account Link */}
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

                {/* Decorative Pattern Divider Bottom */}
                <PatternDivider />

                {/* Footer Copyright */}
                <div className="text-center py-4 text-xs text-gray-500 bg-white">
                    &copy; 2021 Copyright. sokotimam.com
                </div>
            </div>
        </div>
    );
};


// --- Sign Up Page Component (New Component) ---
const SignUpPage = ({ onViewChange }) => {
    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    };

    // function to validate the signup inputs 
    const validateInputs = () => {
        const { firstName, lastName, phone, email, password, confirmPassword } = signupData;
        if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
            toast.error('Please fill in all fields.');
            return false;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return false;
        }
        if (!/^\d{10}$/.test(phone)) {
            toast.error('Invalid phone number.');
            return false;
        }
        // password strength 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return false;
        }


        return true;
    }


    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;
        console.log("Sign Up Data:", signupData);
        setLoading(true);
        try {
            const res = await auth.register(signupData);
            console.log(res);
        } catch (error) {
            toast.error("something went wrong")
            console.log(error);
            setLoading(false);

        }
        // Placeholder sign-up logic would go here
        console.log("Attempting sign-up...");
    };

    const darkBrown = '#5e382b'; // Darker brown for the left panel

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-0 font-sans">

            {/* Main Container: Full width on mobile, split screen on desktop */}
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 transform min-h-[600px]">

                {/* Left Panel: Branding and Welcome (Dark Brown) */}
                {/* chould be hidden in small screens  */}
                <div className={`w-full hidden md:block md:w-5/12 bg-[${darkBrown}]  text-white p-8 sm:p-12 flex flex-col justify-start relative`}>


                    <img src={'/signu.png'} className='w-full h-full object-cover' />
                    {/* Bottom Pattern Divider */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <PatternDivider />
                    </div>
                </div>

                {/* Right Panel: Sign Up Form (White) */}
                <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign Up</h2>

                    <form onSubmit={handleSignUp}>

                        {/* 2-Column Grid for Name and Contact */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            <SignupInputField label="First Name" type="text" name="firstName" placeholder="firstname" onChange={handleInputChange} />
                            <SignupInputField label="Last Name" type="text" name="lastName" placeholder="Kisilu" onChange={handleInputChange} />
                            <SignupInputField label="Phone" type="tel" name="phone" placeholder="phone" onChange={handleInputChange} />
                            <SignupInputField label="Email" type="email" name="email" placeholder="email" onChange={handleInputChange} />
                        </div>

                        {/* 2-Column Grid for Passwords */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            <SignupInputField label="Password" type="password" name="password" placeholder="password" onChange={handleInputChange} />
                            <SignupInputField label="Confirm Password" type="password" name="confirmPassword" placeholder="confirm password" onChange={handleInputChange} />
                        </div>

                        {/* Terms and Conditions Checkbox */}
                        <div className="flex items-center mt-4 mb-8 text-sm">
                            <input
                                id="terms"
                                type="checkbox"
                                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 font-medium text-gray-600">
                                I agree to the <a href="#" className="text-orange-600 hover:underline">terms and conditions</a>
                            </label>
                        </div>

                        {/* Button and Sign In Link */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10">
                            <button
                                type="submit"
                                className="bg-[#985942] text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-[#864c37] transition duration-200 w-full sm:w-auto"
                            >
                                Create Account
                            </button>

                            <div className="mt-4 sm:mt-0 text-sm text-gray-600">
                                Already have an account{' '}
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onViewChange('login'); }}
                                    className="text-orange-600 font-medium hover:underline transition duration-150"
                                >
                                    Sign In
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component to manage state and view switching ---
const Auth = () => {
    const [view, setView] = useState('login'); // 'login' or 'signup'

    return (
        <>
            {view === 'login' && <LoginPage onViewChange={setView} />}
            {view === 'signup' && <SignUpPage onViewChange={setView} />}
        </>
    );
};

export default Auth;
