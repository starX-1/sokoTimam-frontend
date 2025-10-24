'use client'
import { CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const VerificationPage = ({ onViewChange }) => {
    // Array to hold the verification code digits (e.g., 6 digits)
    const [code, setCode] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);
    const isCodeComplete = code.every(digit => digit !== '');

    // Focus on the first input field when the component mounts
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (/[^0-9]/.test(value)) return; // Only allow numbers

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Take only the last character entered
        setCode(newCode);

        // Auto-focus to the next input field
        if (value && index < code.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move to the previous input field on Backspace if current field is empty
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        if (isCodeComplete) {
            const verificationCode = code.join('');
            console.log("Verifying code:", verificationCode);

            // Mock verification success
            alert('Account verified successfully!');
            onViewChange('login');
        } else {
            console.log("Please enter the complete 6-digit code.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform text-center">

                <div className="p-8 pb-0 flex flex-col items-center">
                    <div className="mb-6">
                        {/* <Logo /> */}
                        <img src="/soko.png" alt="" className="object-cover" width={100} height={100} />
                    </div>
                </div>

                {/* <PatternDivider /> */}

                <div className="p-8 pt-10">
                    <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Account</h2>
                    <p className="text-gray-600 mb-8 px-4 text-sm">
                        Please enter the 6-digit verification code sent to your email address:
                        <strong className="block text-gray-800">user@example.com</strong>
                    </p>

                    <form onSubmit={handleVerify}>
                        {/* OTP Input Fields */}
                        <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="tel" // Use tel for mobile numeric keyboard
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-10 h-12 sm:w-12 sm:h-14 text-2xl text-center border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:outline-none transition duration-150 font-mono text-gray-900"
                                    required
                                />
                            ))}
                        </div>

                        {/* Verify Button (Earth brown color: #985942) */}
                        <button
                            type="submit"
                            disabled={!isCodeComplete}
                            className={`w-full py-3 rounded-xl font-semibold text-lg shadow-md transition duration-200 ${isCodeComplete
                                    ? 'bg-[#985942] text-white hover:bg-[#864c37]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Verify Account
                        </button>

                        <div className="mt-6 text-sm">
                            <p className="text-gray-600">Didn't receive the code?</p>
                            <a href="#" className="text-orange-600 font-medium hover:underline transition duration-150">
                                Resend Code
                            </a>
                        </div>
                    </form>
                </div>

                {/* <PatternDivider /> */}

                <div className="text-center py-4 text-xs text-gray-500 bg-white">
                    &copy; 2025 Copyright. sokotimam.com
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;