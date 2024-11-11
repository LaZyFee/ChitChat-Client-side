import { create } from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;

const useAuth = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("user"),
    error: null,
    isLoading: false,

    setToken: (token) => {
        localStorage.setItem("token", token);
        set({ isAuthenticated: !!token });
    },

    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user, isAuthenticated: true });
    },
    signup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            const { user, token } = response.data;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);

            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error signing up",
                isLoading: false,
            });
            throw error;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
                { email, password }
            );

            const { user, token } = response.data;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);

            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error logging in",
                isLoading: false,
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            set({
                user: null,
                isAuthenticated: false,
                isAdmin: false,
                isAdminLoading: false,
                isLoading: false,
            });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    }
}));

export { useAuth };
