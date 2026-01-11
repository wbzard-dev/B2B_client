import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await api.get("/auth/me");
                    setUser(res.data);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error(err);
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setIsAuthenticated(true);
    };

    const registerCompany = async (formData) => {
        const res = await api.post("/auth/register-company", formData);
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setIsAuthenticated(true);
    };

    const registerDistributor = async (formData) => {
        const res = await api.post("/auth/register-distributor", formData);
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData) => {
        setUser((prevUser) => ({ ...prevUser, ...userData }));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                registerCompany,
                registerDistributor,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
