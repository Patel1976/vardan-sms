import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { parseCookies } from "nookies";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const API_URL_STAFF = import.meta.env.VITE_BASE_URL;
    const { token } = parseCookies();
    useEffect(() => {
        if (!token) return;
        const fetchUser = async () => {
            try {
                const res = await axios.post(
                    `${API_URL_STAFF}user-profile`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.status === 200 && res.data.success === 1) {
                    setUser(res.data.data);
                    localStorage.setItem("user", JSON.stringify(res.data.data));
                }
            } catch (error) {
                console.error("User fetch error:", error);
            }
        };
        if (!user) {
            fetchUser();
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};