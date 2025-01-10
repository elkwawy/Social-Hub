import { useState } from "react";
import { LuEyeOff, LuEye } from "react-icons/lu";
const PasswordForm = ({
  labelName,
  name,
  value,
  onChange,
  onBlur,
  condition,
  errorMessage,
  PasswordLight,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="password">
      <div className="flex w-full items-center justify-between gap-1  text-sm font-medium text-gray-700 ">
        <p className="mb-2">{labelName}</p>
        {condition && (
          <p className="py-0.5 px-4 mb-1 bg-red-100 text-red-500 rounded-sm">
            {errorMessage}
          </p>
        )}
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="• • • • • • • • •"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full relative p-2 outline-1 border-2 rounded-md bg-gray-50 ${
            condition
              ? "outline-red-400 border-red-400"
              : "focus:outline-gray-400"
          } `}
        />
        {PasswordLight > 0 && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className=" absolute top-1/2 -translate-y-1/2 right-2 bg-[#f9fafb] ل p-2"
          >
            {showPassword && <LuEyeOff />}
            {!showPassword && <LuEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default PasswordForm;
