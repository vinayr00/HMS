import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // On mount: validate stored token against the real backend
    useEffect(() => {
        const token = localStorage.getItem("hms_token");
        if (!token) {
            setAuthReady(true);
            return;
        }

        authService.me()
            .then((userData) => {
                const normalizedUser = { ...userData, role: userData.role.toUpperCase() };
                setUser(normalizedUser);
                setIsAuthenticated(true);
            })
            .catch((err) => {
                // Only purge tokens on definitive authentication rejection (401)
                // Avoid logging users out on Render cold starts or temporary network errors
                if (err.status === 401) {
                    localStorage.removeItem("hms_token");
                    localStorage.removeItem("hms_user");
                    localStorage.removeItem("hms_role");
                    setUser(null);
                    setIsAuthenticated(false);
                } else {
                    console.warn("Auth check encountered network/server error (possible cold start):", err.message);
                }
            })
            .finally(() => setAuthReady(true));
    }, []);

    const login = async (role, id, password) => {
        try {
            const data = await authService.login(role, id, password);
            // data = { token, user: { id, name, role, employeeId, department, email } }

            const normalizedUser = { ...data.user, role: data.user.role.toUpperCase() };

            setUser(normalizedUser);
            setIsAuthenticated(true);

            localStorage.setItem("hms_token", data.token);
            localStorage.setItem("hms_role", normalizedUser.role);
            localStorage.setItem("hms_user", JSON.stringify(normalizedUser));

            return { success: true, role: normalizedUser.role };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("hms_token");
        localStorage.removeItem("hms_role");
        localStorage.removeItem("hms_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, authReady, isAuthenticated }}>
            {authReady && children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
