import { useEffect, useState } from "react";
import axiosInstance from "../services/api";
import { AuthContext } from "./auth";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await axiosInstance.get("/user/dashboard");
            if (res.status === 200) {
                setUser(res.data.user || { authenticated: true });
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            const res = await axiosInstance.get("/user/dashboard");
            if (res.status === 200) {
                setUser(res.data.user || { authenticated: true });
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
            setUser(null);
            setLoading(false);
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if API fails, clear local state
            setUser(null);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider as default };
