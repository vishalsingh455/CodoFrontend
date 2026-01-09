import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import Register from "./Register";
import { useAuth } from "../context/auth";
import { ToastContainer, toast, Bounce } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState('email'); // 'email' or 'otp'
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [forgotPasswordError, setForgotPasswordError] = useState("");

    const navigate = useNavigate();
    const { user, loading, refreshUser } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [loading, user, navigate]);

    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            await api.post("/auth/login", { email, password });
            await refreshUser();
            navigate('/dashboard', { replace: true });
            toast.success(' Login Successful!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        } catch (e) {
            setError(
                e.response?.data?.message || "Something went wrong"
            );
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotPasswordError("");

        try {
            await api.post("/auth/forgot-password", { email: forgotEmail });
            setForgotPasswordStep('otp');
            toast.success('OTP sent to your email!', {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Bounce,
            });
        } catch (error) {
            setForgotPasswordError(error.response?.data?.message || "Something went wrong");
        }
    };

    
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setForgotPasswordError("");

        try {
            await api.post("/auth/reset-password", { otp, newPassword });
            setShowForgotPassword(false);
            setForgotPasswordStep('email');
            setForgotEmail("");
            setOtp("");
            setNewPassword("");
            toast.success('Password reset successful! Please login with your new password.', {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Bounce,
            });
        } catch (error) {
            setForgotPasswordError(error.response?.data?.message || "Something went wrong");
        }
    };

    const closeForgotPassword = () => {
        setShowForgotPassword(false);
        setForgotPasswordStep('email');
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setForgotPasswordError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <form onSubmit={(e) => {
                handleLogin(e)
            }} className="bg-gray-900 p-8 rounded-xl w-96 shadow-xl">
                <h2 className="text-2xl text-white font-bold mb-6 text-center">
                    Login to CodeArena
                </h2>

                <input
                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white outline-none"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full mb-6 px-4 py-2 rounded bg-gray-800 text-white outline-none"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white font-semibold">
                    Login
                </button>

                <div className="mt-4 text-center">
                    <p className="text-indigo-400 hover:text-indigo-300 cursor-pointer mb-2" onClick={() => setShowForgotPassword(true)}>Forgot Password?</p>
                    <p className="text-indigo-400 hover:text-indigo-300 cursor-pointer" onClick={() => navigate('/register')}>Don't have an account? Register</p>
                </div>

                {error && (
                    <p className="text-red-400 text-sm mb-3 text-center">
                        {error}
                    </p>
                )}
            </form>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-8 rounded-xl w-96 shadow-xl relative">
                        <button
                            onClick={closeForgotPassword}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <h3 className="text-xl text-white font-bold mb-6 text-center">
                            {forgotPasswordStep === 'email' ? 'Reset Password' : 'Enter OTP'}
                        </h3>

                        {forgotPasswordStep === 'email' ? (
                            <form onSubmit={handleForgotPassword}>
                                <input
                                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white outline-none"
                                    placeholder="Enter your email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                />

                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white font-semibold">
                                    Send OTP
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <input
                                    className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white outline-none"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />

                                <input
                                    type="password"
                                    className="w-full mb-6 px-4 py-2 rounded bg-gray-800 text-white outline-none"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />

                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white font-semibold">
                                    Reset Password
                                </button>
                            </form>
                        )}

                        {forgotPasswordError && (
                            <p className="text-red-400 text-sm mt-3 text-center">
                                {forgotPasswordError}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
