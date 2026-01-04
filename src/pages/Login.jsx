import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import Register from "./Register";
import { useAuth } from "../context/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")

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
        } catch (e) {
            setError(
                e.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <form onSubmit={(e)=> {
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

                <p className="w-full text-center text-indigo-400 hover:text-indigo-300 py-2 mt-4 cursor-pointer" onClick={() => navigate('/register')}>Don't have an account? Register</p>

                {error && (
                    <p className="text-red-400 text-sm mb-3 text-center">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
};

export default Login;
