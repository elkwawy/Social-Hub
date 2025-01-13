import { useEffect, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../Redux/slices/userSlice";
import Loader from "../../Utils/Loader";
import GoogleLoginAuth from "./GoogleLogin";


const SignUp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const [touched, setTouched] = useState({});
  const handleBlur = (e) => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    });
  };

  const validateForm = (values) => {
    const errors = {};

    // User Name Validation
    if (!values.name) {
      errors.name = "User Name is required";
    } else if (values.name.length < 3 || values.name.length > 20) {
      errors.name = "User Name must be between 3 and 20 characters";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(values.name)) {
      errors.name = "User Name can only contain letters, numbers, and spaces";
    }

    // Email Validation
    if (!values.email) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) // Regex for email validation
    ) {
      errors.email = "Invalid email address";
    }

    // Password Validation
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    return errors; // Returns an object with validation error messages
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.user.status);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // touched تحديد كل الحقول كـ
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTouched(allTouched);

    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Show errors
      return;
    } else {
      setErrors(validationErrors);
    }

    const res = await dispatch(signupUser(values)).unwrap();
    console.log(res);

    if (res) {
      navigate("/otpVerification", {
        state: { name: values.name,email:values.email , password: values.password },
      });
    }
  };

  useEffect(() => {
    setErrors(validateForm(values));
  }, [values]);

  
  return (
    <div className="w-full h-[calc(100vh-72px)] md:h-[calc(100vh-70px)] flex items-center justify-center">
      
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md border w-11/12 sm:w-[550px]">
        <h2 className="text-2xl font-bold text-center mb-2">
          Create an Account
        </h2>
        <p className="text-gray-600 text-center text-sm mb-6">
          Create your account by filling in the details below
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="username">
            <div className=" w-full  flex items-center justify-between gap-1  text-sm font-medium text-gray-700 ">
              <p className="mb-2">User Name:</p>
              {touched.name && errors.name && (
                <p className="py-0.5 px-4 mb-1 bg-red-100 text-red-500 rounded-sm">
                  {errors.name}
                </p>
              )}
            </div>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 outline-1 border-2 rounded-md bg-gray-50 ${
                touched.name && errors.name
                  ? "outline-red-400 border-red-400"
                  : "focus:outline-gray-400"
              }  `}
              placeholder="Enter your name"
            />
          </div>
          <div className="email">
            <div className=" w-full  flex items-center justify-between gap-1  text-sm font-medium text-gray-700 ">
              <p className="mb-2">Email:</p>
              {touched.email && errors.email && (
                <p className="py-0.5 px-4 mb-1 bg-red-100 text-red-500 rounded-sm">
                  {errors.email}
                </p>
              )}
            </div>
            <input
              type="text"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 outline-1 border-2 rounded-md bg-gray-50 ${
                touched.email && errors.email
                  ? "outline-red-400 border-red-400"
                  : "focus:outline-gray-400"
              }  `}
              placeholder="Enter your email"
            />
          </div>
          <div className="password">
            <div className="flex w-full items-center justify-between gap-1  text-sm font-medium text-gray-700 ">
              <p className="mb-2">Password:</p>
              {touched.password && errors.password && (
                <p className="py-0.5 px-4 mb-1 bg-red-100 text-red-500 rounded-sm">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="• • • • • • • • •"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full relative p-2 outline-1 border-2 rounded-md bg-gray-50 ${
                  touched.password && errors.password
                    ? "outline-red-400 border-red-400"
                    : "focus:outline-gray-400"
                } `}
              />
              {values.password.length > 0 && (
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className=" absolute top-1/2 -translate-y-1/2 right-2 bg-[#f9fafb] p-2"
                >
                  {showPassword && <LuEyeOff />}
                  {!showPassword && <LuEye />}
                </button>
              )}
            </div>
          </div>
          {status !== "loading" && (
            <button
              type="submit"
              className={`w-full bg-main-color text-white border-[1px] border-main-color py-2 rounded-md hover:bg-sec-color hover:border-sec-color trans `}
            >
              Sign Up
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
          Already have an account?{" "}
          <Link to="/login" className="text-main-color hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
