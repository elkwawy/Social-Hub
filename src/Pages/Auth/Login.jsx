import { useCallback, useEffect, useRef, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { loginUser } from "../../Redux/slices/userSlice";
import Loader from "../../Utils/Loader";
import GoogleLoginAuth from './GoogleLogin';

const Login = () => {
  const location = useLocation();
  const loginBtnRef = useRef(null);

  const usernameFromSignup = location.state?.name || "";
  const passwordFromSignup = location.state?.password || "";

  const [inputs, setInputs] = useState({
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    nameError: "",
    passwordError: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const status = useSelector((state) => state.user.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (usernameFromSignup && passwordFromSignup) {
      dispatch(
        loginUser({ name: usernameFromSignup, password: passwordFromSignup })
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkIfInputsValid()) {
      dispatch(loginUser({ name: inputs.name, password: inputs.password }));
    }
  };

  const handleInputsChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const checkIfInputsValid = useCallback(() => {
    let isValid = true;
    if (!inputs.name && !inputs.password) {
      setErrors({
        passwordError: "Please enter your password",
        nameError: "Please enter your username",
      });
      isValid = false;
    } else if (!inputs.name) {
      setErrors({ ...errors, nameError: "Please enter your name" });
      isValid = false;
    } else if (!inputs.password) {
      setErrors({ ...errors, passwordError: "Please enter your password" });
      isValid = false;
    }
    if (isValid) {
      setErrors({});
      return true;
    }
    return false;
  }, [inputs]);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full h-[calc(100vh-72px)] md:h-[calc(100vh-70px)] flex items-center justify-center">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md border w-11/12 sm:w-[550px]">
        <h2 className="text-2xl font-bold text-center mb-2">
          Login to Account
        </h2>
        <p className="text-gray-600 text-center text-sm mb-6">
          Please enter your username and password to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={`focus:border-main-color`}>
            <div className=" w-full  flex items-center justify-between  text-sm font-medium text-gray-700 ">
              <p className="mb-2">User name:</p>
              {errors.nameError && (
                <p className="py-0.5 px-4 mb-1 bg-red-100 text-red-500 rounded-sm">
                  {errors.nameError}
                </p>
              )}
            </div>
            <input
              type="text"
              name="name"
              value={usernameFromSignup ? usernameFromSignup : inputs.name}
              onChange={handleInputsChange}
              className={`w-full p-2 outline-1 border-2 rounded-md bg-gray-50 ${
                errors.nameError
                  ? "outline-red-400 border-red-400"
                  : "focus:outline-gray-400"
              }`}
              placeholder="Enter your username"
            />
          </div>
          <div className="">
            <div className="flex w-full items-center justify-between text-sm font-medium text-gray-700 ">
              <p className="mb-2">Password:</p>
              {errors.passwordError && (
                <p className="py-0.5 px-4 mb-1 bg-red-100 text-red-500 rounded-sm">
                  {errors.passwordError}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                name="password"
                placeholder="• • • • • • • • •"
                value={
                  passwordFromSignup ? passwordFromSignup : inputs.password
                }
                onChange={handleInputsChange}
                className={`w-full relative p-2 outline-1 border-2 rounded-md bg-gray-50 ${
                  errors.passwordError
                    ? "outline-red-400 border-red-400"
                    : "focus:outline-gray-400"
                } `}
              />
              {(inputs.password.length > 0 ||
                passwordFromSignup.length > 0) && (
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="w-10 flex justify-end absolute top-1/2 -translate-y-1/2 right-2 "
                >
                  {showPassword && <LuEyeOff />}
                  {!showPassword && <LuEye />}
                </button>
              )}
            </div>
            <Link
              to={"/resetPassword"}
              className="text-sec-color flex float-end mt-1 cursor-pointer hover:underline"
            >
              Forgot Password
            </Link>
            </div>
          {status !== "loading" && (
            <button
              type="submit"
              ref={loginBtnRef}
              className={`w-full bg-main-color text-white border-[1px] border-main-color py-2 rounded-md hover:bg-sec-color hover:border-sec-color trans `}
            >
              Login
            </button>
          )}

          {status === "loading" && (
            <div className="w-full justify-center h-[41px] mt-[16px] flex items-center">
              <Loader />
            </div>
          )}
        </form>
        <GoogleLoginAuth />
        <p className="text-gray-600 mt-4 text-center">
          Create a new account?{" "}
          <Link to="/signup" className="text-main-color hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
