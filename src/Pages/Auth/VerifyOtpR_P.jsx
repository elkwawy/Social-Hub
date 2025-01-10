import axios from "axios";
import { API } from "../../Api/Api";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../Utils/showToast";
import PasswordForm from "../../Components/helpers/PasswordForm";
const VerifyOtpR_P = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    setPasswordError("");

    let hasError = false;
    if (!otp) {
      setOtpError("OTP is required.");
      hasError = true;
    } else if (!newPassword) {
      setPasswordError("New password is required.");
      hasError = true;
    }
    if (hasError) return;

    try {
      setLoading(true);
      const response = await axios.post(API.verifyOtpAndResetPassword, {
        email,
        otp,
        newPassword,
      });
      console.log(response);
      
      showToast(
        "success",
        response?.data?.message || "Password reset successful. Redirecting to login..."
      );
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-72px)] md:h-[calc(100vh-70px)] flex items-center justify-center">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md border w-11/12 sm:w-[550px]">
        <h2 className="text-2xl font-bold text-center mb-2">Verify OTP</h2>
        <p className="text-gray-600 text-center text-sm mb-6">
          Enter the OTP sent to your email and set a new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="w-full flex items-center justify-between text-sm font-medium text-gray-700">
              <p className="mb-2">OTP</p>
              {otpError && (
                <p className="py-0.5 px-4 mb-1 bg-red-100 text-red-500 rounded-sm">
                  {otpError}
                </p>
              )}
            </div>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={`w-full p-2 outline-1 border-2 rounded-md bg-gray-50 ${
                otpError
                  ? "border-red-400 focus:outline-red-400"
                  : "focus:outline-gray-400"
              }`}
              placeholder="Enter OTP"
            />
          </div>
          <PasswordForm
            labelName={"New Password"}
            name={"password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={null}
            condition={passwordError}
            errorMessage={passwordError}
            PasswordLight={newPassword.length}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-main-color border-main-color hover:bg-sec-color hover:border-sec-color"
            }`}
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpR_P;
