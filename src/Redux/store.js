import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import randomVideos from "./slices/randomVideos";
import trendyVideos from "./slices/trendyVideos";
import getUserSlice from "./slices/getUserById";
import postsSlice from "./slices/postsReducer";
import usersSlice from "./slices/usersSlice";
import userChats from "./slices/userChats";
import chatReducer from "./slices/chatSlice";
import savedVideosSlice from "./slices/savedVideos";

const store = configureStore({
  reducer: {
    user: userSlice,
    randomVideos: randomVideos,
    trendyVideos: trendyVideos,
    getUser: getUserSlice,
    posts: postsSlice,
    users: usersSlice,
    userChats: userChats,
    chat: chatReducer,
    savedVideos:savedVideosSlice
  },
});

export default store;
