import { create } from 'zustand';
import axios from 'axios';

const useUserStore = create((set) => ({
    users: [],
    fetchUsers: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ users: response.data });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    },
}));

export default useUserStore;
