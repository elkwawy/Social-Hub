import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { API } from "../../Api/Api"
import sweetalert from '../../Utils/sweetalert';
import { showToast } from "../../Utils/showToast";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ name, password, otp }, { rejectWithValue }) => {
    console.log(otp);
    try {
      const response = await axios.post(API.signin, { name, password });
  
      // If backend returns error status code (e.g., 400 or 401), manually throw an error
      // to excute loginUser.rejected
      // unauthorized
      if (response.status === 401) {
        Cookies.remove("userID");
        window.location.href = "/";
      }
      else if (response.status !== 200) {
        throw new Error(
          response.data.message || "Something went wrong with the backend."
        );
      }
      console.log(response.data.user);
      return response.data.user; // Return the data if everything is fine

    } catch (error) {
      // Handle network errors (e.g., no connection, server is down)
      if (!error.response) {
        console.error("Network error:", error.message);

        return rejectWithValue(
          "Network error, please check your connection and try again."
        );
      }

      // Handle backend errors (e.g., wrong email/password)
      if (error.response?.data) {
        // console.error('Backend error:', error.response.data);
        return rejectWithValue(
          error.response.data.message ||
            "Something went wrong with the backend."
        );
      }

      // Fallback for other types of errors
      console.error("Unexpected error:", error.message);
      return rejectWithValue(error.message || "An unexpected error occurred.");
    }
  }
);

export const logUserOut = createAsyncThunk("user/logUserOut", async () => {
  Cookies.remove("userID");
  window.location.href = "/";
  return null;
});

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(API.signup, values);
      if (response.status !== 200 && response.status !== 202) {
        throw new Error(
          response.data.message || "Something went wrong with the backend."
        );
      }
      return response.data; // response نجاح العملية بيرجع الـ
    } catch (error) {
      // Handle network errors (e.g., no connection, server is down)
      if (!error.response) {
        console.error("Network error:", error.message);

        return rejectWithValue(
          "Network error, please check your connection and try again."
        );
      }

      // Handle backend errors (e.g., wrong email/password)
      if (error.response?.data) {
        // console.error('Backend error:', error.response.data);
        return rejectWithValue(
          error.response.data.message ||
            "Something went wrong with the backend."
        );
      }

      // Fallback for other types of errors
      console.error("Unexpected error:", error.message);
      return rejectWithValue(error.message || "An unexpected error occurred.");
    }
  }
);

export const getCurrUser = createAsyncThunk(
  "user/getCurrUser",
  async (id, { rejectWithValue }) => {
    try {
      const userData = await axios.get(`${API.getUserById}/${id}`);      
      if (userData.status !== 200) {
        throw new Error(
          response.data.message || "Something went wrong with the backend."
        );
      }
      return userData.data; 
    } catch (error) {
      console.log("Get user error : ", error);
      
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message.slice(50) ||
            "Something went wrong with the backend."
        );
      }
      return rejectWithValue(error.message || "An unexpected error occurred.");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateUserCommunities: (state, action) => {
      if (state.user) {
        state.user.communities = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        console.log(action.payload); // user details
        state.status = "succeeded";
        showToast("success", "User successfully logged in");
        Cookies.set("userID", action.payload._id);
        window.location.href = "/socialHub";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        showToast("error", action.payload);
      })
      .addCase(logUserOut.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logUserOut.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(logUserOut.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        // showToast('success', "Check your email and verify OTP")
        showToast('success', "OTP has been sent to your email. Please verify to complete sign-up.")
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        showToast("error", action.payload);
      })
      .addCase(getCurrUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCurrUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(getCurrUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.log(action.payload);
        sweetalert.error("", "Network Error");

      });
  },
});

export const {  updateUserCommunities} = userSlice.actions;
export default userSlice.reducer;
