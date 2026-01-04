import { useEffect, useState } from "react";
import axiosInstance from "../services/api";
import { AuthContext } from "./auth";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const logoutTime = localStorage.getItem('logoutTime');
        if (logoutTime && Date.now() - parseInt(logoutTime) < 5000) {
            // Recently logged out, skip API call and set user to null
            localStorage.removeItem('logoutTime');
            setUser(null);
            setLoading(false);
            return;
        }

        // If user has logged out previously and not logged back in, skip API call
        if (localStorage.getItem('userLoggedOut') === 'true') {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await axiosInstance.get("/user/dashboard");
            if (res.status === 200) {
                setUser(res.data.user || { authenticated: true });
                // Clear the logged out flag since user is authenticated
                localStorage.removeItem('userLoggedOut');
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
            localStorage.setItem('userLoggedOut', 'true');
            setUser(null);
            setLoading(false);
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if API fails, clear local state
            localStorage.setItem('userLoggedOut', 'true');
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
