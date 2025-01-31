// store/chatSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../Api/Api";
import { showToast } from "../../Utils/showToast";


export const getSavedVideos = createAsyncThunk('savedVideos/getSavedVideos',async () => {
    try {        
        const res = await axios.get(API.getSavedVideos);
        return res.data.savedVideos;
    } catch (error) {
        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
            return rejectWithValue('Network error, please check your connection and try again.');
        }

        // Handle backend errors
        if (error.response?.data) {
            return rejectWithValue(error.response.data.message || 'Something went wrong with the server.');
        }
        // Fallback for other types of errors
        console.error('Unexpected error:', error.message);
        return rejectWithValue(error.message || 'An unexpected error occurred.');
    }
});
export const handleSaveVideo = createAsyncThunk(
    'savedVideos/handleSaveVideo',
    async (video, { getState, rejectWithValue }) => {
        try {
            await axios.post(`${API.saveVideo}/${video._id}`);
            return video;
        } catch (error) {
            // Rollback if API request fails
            const state = getState().savedVideos;
            return rejectWithValue({
                error: error?.response?.data?.message || "Failed to save video",
                rollback: state.savedVideos.filter(v => v._id !== video._id),
            });
        }
    }
);

export const handleUnsaveVideo = createAsyncThunk(
    'savedVideos/handleUnsaveVideo',
    async (video, { getState, rejectWithValue }) => {
        try {
            await axios.post(`${API.unSaveVideo}/${video._id}`);
            return video;
        } catch (error) {
            // Rollback if API request fails
            const state = getState().savedVideos;
            return rejectWithValue({
                error: error?.response?.data?.message || "Failed to unsave video",
                rollback: [...state.savedVideos, video],
            });
        }
    }
);

const savedVideosSlice = createSlice({
    name: "savedVideos",
    initialState: {
        savedVideos: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // Get Saved Videos
            .addCase(getSavedVideos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSavedVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.savedVideos = action.payload;
            })
            .addCase(getSavedVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Save Video - Optimistic Update
            .addCase(handleSaveVideo.pending, (state, action) => {
                // action.meta.arg is the first argument passed to the fucntion above
                state.savedVideos.push(action.meta.arg); // Add video immediately
            })
            .addCase(handleSaveVideo.fulfilled, (state, action) => {
                showToast('success', "Video saved successfully");
            })
            .addCase(handleSaveVideo.rejected, (state, action) => {
                showToast('error', action.payload?.error);
                state.savedVideos = action.payload?.rollback || state.savedVideos;
            })

            // Unsave Video - Optimistic Update
            .addCase(handleUnsaveVideo.pending, (state, action) => {
                state.savedVideos = state.savedVideos.filter(v => v._id !== action.meta.arg._id);
            })
            .addCase(handleUnsaveVideo.fulfilled, (state, action) => {
                showToast('success', "Video unsaved successfully");
            })
            .addCase(handleUnsaveVideo.rejected, (state, action) => {
                showToast('error', action.payload?.error);
                state.savedVideos = action.payload?.rollback || state.savedVideos;
            });
    },
});

export default savedVideosSlice.reducer;