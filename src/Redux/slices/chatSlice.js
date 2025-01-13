// store/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../Api/Api";

import { socket } from "../../Pages/socialHub/SocialHubLayout";

// Fetch messages thunk
export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async (chatId, { rejectWithValue }) => {
        try {
            console.log(chatId);
            
            const response = await axios.get(`${API.getMessages}/${chatId}`);
            console.log(response.data);
            return response.data.messages;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || "Error fetching chat messages.");
        }
    }
);

// Send message thunk
export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async ({ message, userId, senderImg, senderName, receiverId }, { rejectWithValue, getState, dispatch }) => {
        try {

            const newMessage = {
                msg: message,
                senderId: userId,
                senderImg,
                senderName,
                to: receiverId,
                content: message,
                timestamp: Date.now(),
            };

            // Optimistic UI update
            dispatch(addMessage(newMessage));

            const res = await axios.post(`${API.SendMessege}`, {
                receiverId: receiverId,
                content: newMessage.content,
            });

            socket.current.emit("send-msg", newMessage);

            return newMessage;
        } catch (error) {
            return rejectWithValue("Error sending the message.");
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        newMessages:[],
        loading: false,
        error: null,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        receiveMessage: (state, action) => {

            state.messages.push(action.payload);
        },
        clearChat:(state) => { 
            state.messages = [];
        },
        pushNewMessageToUnReadMessages: (state, action) => {
            state.newMessages.push(action.payload);
        },
        clearNewMessages:(state) => { 
            state.newMessages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.length <= 0) {
                    state.messages = []; // Clear the messages
                } else {
                    state.messages = action.payload;
                }
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                

                state.error = action.payload;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { addMessage, receiveMessage, clearChat,pushNewMessageToUnReadMessages,clearNewMessages } = chatSlice.actions;
export default chatSlice.reducer;
