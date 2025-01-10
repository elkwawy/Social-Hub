import axios from "axios";
import { API } from "../../Api/Api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../Utils/showToast";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtpForResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API.sendOtpForResetPassword, { email });
      showToast(
        "success",
        response?.data?.message ||
          "OTP has been sent to your email. Please check your inbox."
      );

      navigate("/verifyOtp", { state: { email } }); // Navigate to the next page with the email
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      //   showToast(
      //     "error",
      //     error.response?.data?.message || "An error occurred. Please try again."
      //   );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full h-[calc(100vh-72px)] md:h-[calc(100vh-70px)] flex items-center justify-center">
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md border w-11/12 sm:w-[550px]">
          <h2 className="text-2xl font-bold text-center mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 text-center text-sm mb-6">
            Please enter your email to reset your password.
          </p>

          <form onSubmit={sendOtpForResetPassword} className="space-y-6">
            <div>
              <div className="w-full flex items-center justify-between text-sm font-medium text-gray-700">
                <p className="mb-2">Email</p>
                {error && (
                  <p className="py-0.5 px-4 mb-1 bg-red-100 text-red-500 rounded-sm">
                    {error}
                  </p>
                )}
              </div>

              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 outline-1 border-2 rounded-md bg-gray-50 ${
                  error
                    ? "border-red-400 focus:outline-red-400"
                    : "focus:outline-gray-400"
                }`}
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-main-color border-main-color hover:bg-sec-color hover:border-sec-color"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          <p className="text-gray-600 mt-4 text-center">
            If you remember the password?{" "}
            <Link to="/login" className="text-main-color hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
