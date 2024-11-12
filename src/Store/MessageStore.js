import { create } from 'zustand';
import axios from 'axios';

const MessageStore = create((set) => ({
    messages: [],
    fetchMessages: async (chatId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/message/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ messages: response.data });
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    },
    sendMessage: async (senderId, receiverId, content, chatId) => {
        console.log("sendeId: ", senderId, "receiverId: ", receiverId, "Content: ", content, "chatId: ", chatId);
        try {
            const token = localStorage.getItem('token');

            // Send the message with the chatId (whether new or existing)
            const messageResponse = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/message/sendMessage`,
                { sender: senderId, receiver: receiverId, content, chatId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            set((state) => ({ messages: [...state.messages, messageResponse.data] }));
        } catch (error) {
            console.error("Error sending message:", error);
        }
    },

    clearMessages: () => set({ messages: [] }),
}));

export default MessageStore;
