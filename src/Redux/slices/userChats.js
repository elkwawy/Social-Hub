import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../Api/Api";
import Cookies from "js-cookie";

export const getMyChats = createAsyncThunk(
    'userChats/getMyChats',
    async (friendChat, { rejectWithValue }) => {
        try {
            const res = await axios.get(API.getUsersInChat);

            
            return {userChats : res.data.messages, friendChat};
        } catch (error) {
            // Handle network errors (e.g., no connection, server is down)

            if (!error.response) {
                console.error('Network error:', error.message);
                return rejectWithValue('Network error, please check your connection and try again.');
            }

            // Handle backend errors (e.g., wrong email/password)
            if (error.response?.data) {
                // console.error('Backend error:', error.response.data);
                return rejectWithValue(error.response.data.message || 'Something went wrong with the backend.');
            }
            // Fallback for other types of errors
            console.error('Unexpected error:', error.message);
            return rejectWithValue(error.message || 'An unexpected error occurred.');
        }
    }
);


const chatsOrganizer = (friendChat, chats, userId) => {

    if (!friendChat) return { updatedChats: chats, activeChatIndex: null };

    console.log("friendChat: ", friendChat);
    
    const index = chats.findIndex(chat => {
        const friendId = userId !== chat.receiverId ? chat.receiverId : chat.senderId;
        return friendId === friendChat.receiverId;
    });

    if (index === -1) {
        // New chat, add to the top
        return { updatedChats: [friendChat, ...chats], activeChatIndex: friendChat.receiverId };
    }

    // Existing chat, set as active
    return { updatedChats: chats, activeChatIndex: friendChat.receiverId };
};


const userChats = createSlice({
    name: 'userChats',
    initialState: {
        chats: [],
        status: "idle",
        activeChat: null,
        error: null,
    },
    reducers: {
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        reorderChatsWhenReceive: (state, action) => {
            // Find the index of the chat with the same ID
            const userId = Cookies.get('userID'); // Pass userId explicitly

            const id = (action.payload.senderId && action.payload.senderId !== userId) ? action.payload.senderId : 
                (action.payload.receiverId && action.payload.receiverId !== userId) ? action.payload.receiverId : null ; 
            
            const existingChatIndex = state.chats.findIndex(
                (chat) =>  { 
                    return ((chat?.senderId === id) || (chat?.receiverId === id))
                }
            );
            if (existingChatIndex !== -1) {
                // If the chat already exists, remove it
                let existingChat = state.chats.splice(existingChatIndex, 1)[0];
                existingChat.content = action.payload.content;
                // Add the existing chat to the top

                state.chats.unshift(existingChat);
            } else {
                // If the chat doesn't exist, add it to the top
                state.chats.unshift(action.payload);
            }
        },
        reorderChatsWhenSend: (state, action) => {
            const userId = Cookies.get("userID"); // Retrieve user ID for comparison
            const {message, id} = action.payload;
            
            // Find the index of the chat matching the sender or receiver
            const existingChatIndex = state.chats.findIndex(
                (chat) =>
                    (chat.senderId === id && chat.senderId !== userId) ||
                (chat.receiverId === id && chat.receiverId !== userId)
            );
            
            if (existingChatIndex !== -1) {
                // Chat exists, move it to the top
                const existingChat = state.chats.splice(existingChatIndex, 1)[0];
                existingChat.content = message;
                state.chats.unshift(existingChat);
            } else {
                // Chat doesn't exist, log an error or handle the case as needed
                console.error(`Chat with ID ${id} not found for reordering.`);
            }
        },

    },
    extraReducers: (builder) => {
        builder
        .addCase(getMyChats.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(getMyChats.fulfilled, (state, action) => {
            state.status = "succeeded";
            const friendChat = action.payload.friendChat;
            const { updatedChats, activeChatIndex } = chatsOrganizer(
                friendChat ? {
                    receiverId: friendChat._id,
                    receiverName: friendChat.name,
                    receiverProfilePicture: friendChat.photoUrl || null,
                    content: "",
                } : null,
                action.payload.userChats,
                Cookies.get('userID') // Pass userId explicitly
            );
            state.chats = updatedChats;
            state.activeChat = activeChatIndex;
        })
        .addCase(getMyChats.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        });
    }
});

export const { setActiveChat, reorderChatsWhenReceive, reorderChatsWhenSend } = userChats.actions;
export default userChats.reducer;