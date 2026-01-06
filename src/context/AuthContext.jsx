import { useEffect, useState } from "react";
import axiosInstance from "../services/api";
import { AuthContext } from "./auth";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");

    const checkAuth = async () => {
        try {
            const res = await axiosInstance.get("/user/dashboard");
            if (res.status === 200) {
                setUser({ authenticated: true });
                //console.log(res)
                setUserName(res.data.user.name)
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
                setUser({ authenticated: true });
                setUserName(res.data.user.name)
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser, userName }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider as default };
