import { lazy } from "react";
import LazyLoad from "@/Components/LazyLoad";
import { Route, Routes } from "react-router-dom";
import LandingPageLayout from "@/Pages/LandingPage/LandingPageLayout";
import ProtectedRoute from "@/Pages/ProtectedRoute";
import PublicRoute from "@/Pages/PublicRoute";
import SocialHubLayout from "@/Pages/socialHub/SocialHubLayout";
import OTPField from "@/Pages/Auth/OTPField";
import Profile from "@/Pages/socialHub/Profile/Profile";
import Posts from "@/Components/socialHub/Profile/Posts/Posts";
import ProfileVideos from "@/Components/socialHub/Profile/ProfileVideos/ProfileVideos";
import Friends from "@/Components/socialHub/Profile/Friends/Friends";
import Saved from "@/Components/socialHub/Profile/Saved/Saved";
import History from "@/Components/socialHub/Profile/History/History";
import VerifyOtpR_P from "@/Pages/Auth/VerifyOtpR_P";
import CommunityChat from "@/Pages/socialHub/CommunityChat";

// Lazy-loaded components
const LandingPage = lazy(() => import("@/Pages/LandingPage/LandingPage"));
const Login = lazy(() => import("@/Pages/Auth/Login"));
const ResetPassword = lazy(() => import("@/Pages/Auth/ResetPassword"));
const SignUp = lazy(() => import("@/Pages/Auth/SignUp"));
const MainPage = lazy(() => import("@/Pages/socialHub/MainPage"));
const MyCommunities = lazy(() => import("@/Pages/socialHub/MyCommunities"));
const MyMessages = lazy(() => import("@/Pages/socialHub/MyMessages"));
const PeopleList = lazy(() => import("@/Pages/socialHub/People/PeopleList"));
const Plans = lazy(() => import("@/Pages/socialHub/Plans"));
const MarketHub = lazy(() => import("@/Pages/socialHub/MarketHub"));
const Reports = lazy(() => import("@/Pages/socialHub/Reports"));
const Trending = lazy(() => import("@/Pages/socialHub/Trending"));
const VideoPlayer = lazy(() => import("@/Pages/socialHub/VideoPlayer"));
const BetaBotAi = lazy(() => import("@/Pages/socialHub/BetaBotAi"));
const NotFound = lazy(() => import("@/Pages/NotFound"));

const AppRoutes = ({ isAuthenticated }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <LandingPageLayout />
          </PublicRoute>
        }
      >
        <Route index element={LazyLoad(LandingPage)} />
        <Route path="login" element={LazyLoad(Login)} />
        <Route path="resetPassword" element={LazyLoad(ResetPassword)} />
        <Route path="verifyOtp" element={LazyLoad(VerifyOtpR_P)} />
        <Route path="otpVerification" element={LazyLoad(OTPField)} />
        <Route path="signup" element={LazyLoad(SignUp)} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/socialHub"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SocialHubLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={LazyLoad(MainPage)} />
        <Route path="trending" element={LazyLoad(Trending)} />
        <Route path="people" element={LazyLoad(PeopleList)} />
        <Route path="plans" element={LazyLoad(Plans)} />
        <Route path="myCommunities" element={LazyLoad(MyCommunities)} />
        <Route path="communityChat/:id" element={LazyLoad(CommunityChat)} />
        <Route path="myMessages" element={LazyLoad(MyMessages)} />
        <Route path="betaBotAi" element={LazyLoad(BetaBotAi)} />
        <Route path="marketHub" element={LazyLoad(MarketHub)} />
        <Route path="reports" element={LazyLoad(Reports)} />
        <Route path="video/:id" element={LazyLoad(VideoPlayer)} />
        <Route path="profile/:id" element={<Profile />}>
          <Route index element={<Posts />} />
          <Route path="videos" element={<ProfileVideos />} />
          <Route path="friends" element={<Friends />} />
          <Route path="saved" element={<Saved />} />
          <Route path="history" element={<History />} />
        </Route>
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={LazyLoad(NotFound)} />
    </Routes>
  );
};

export default AppRoutes;
