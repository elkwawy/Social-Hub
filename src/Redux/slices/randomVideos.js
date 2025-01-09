import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../Api/Api";


export const getRandomVideos = createAsyncThunk(
    'randomVideos/getRandomVideos',
    async ({page}, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API.getRandomVideos}?page=${page}`);
            return { videos: res.data.videos, page };
        } catch (error) {
        // Handle network errors (e.g., no connection, server is down)
            console.log(error);
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




const randomVideos = createSlice({
    name: 'randomVideos',
    initialState: {
        videos: [],
        status: "idle",
        error: null,
        currentPage: 0,
        hasMore: true,
    },
    extraReducers: (builder) => {
        builder
        // Login user
        .addCase(getRandomVideos.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(getRandomVideos.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.videos = [...state.videos, ...action.payload.videos];
            state.currentPage = action.payload.page;
            state.hasMore = action.payload.videos.length > 0;
        })
        .addCase(getRandomVideos.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
            if (action.payload === "No more videos available.") {
                state.hasMore = false;
            }
        });
    }
});

export default randomVideos.reducer;