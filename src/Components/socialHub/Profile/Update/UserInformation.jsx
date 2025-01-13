import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { showToast } from "../../../../Utils/showToast";
import InputForm from "../../../helpers/InputForm";
import PasswordForm from "../../../helpers/PasswordForm";
import ButtonForm from "../../../helpers/ButtonForm";
import { useUsers } from "../../../../Hooks/useUsers";
import { useDispatch } from "react-redux";
import { getCurrUser } from "../../../../Redux/slices/userSlice";
import GhostMode from "../GhostMode";
import LoaderW from "../../../../Utils/loaderW";
function UserInformation({ user, edit, setnameUser , fetchUserById }) {
  const dispatch = useDispatch();
  const { handleUpdateUser, statusUpdate } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    password: "",
  });
  // تحديث القيم بناءً على إدخال المستخدم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // إضافة أو إزالة الحقول التي يريد المستخدم تعديلها
  const toggleField = (field) => {
    if (fields.includes(field)) {
      setFields(fields.filter((f) => f !== field));
    } else {
      setFields([...fields, field]);
    }
  };

  // إرسال التحديث إلى السيرفر
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.currentPassword) {
      showToast("error", "Please enter your current password.");
      return;
    }

    const selectedValues = fields.reduce((acc, field) => {
      acc[field] = values[field];
      return acc;
    }, {});

    selectedValues.currentPassword = values.currentPassword;

    if (Object.keys(selectedValues).length === 1) {
      showToast("error", "Please select at least one field to update.");
      return;
    }

    await handleUpdateUser(user._id, selectedValues);
    setnameUser(values.name);
    toggleModal();
    dispatch(getCurrUser(user._id));
  };

  const { handleSubscribe, handleUnsubscribe } = useUsers();
  const [isFollow, setIsFollow] = useState(user?.isFollowing || false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingUnFollow, setLoadingUnFollow] = useState(false);

  const handleUnFollowBtnClicked = async () => {
    setIsFollow(false);
    setLoadingFollow(true);
    await handleUnsubscribe(user._id);
    setLoadingFollow(false);
  };

  const handleFollowBtnClicked = async () => {
    setIsFollow(true);
    setLoadingUnFollow(true);
    await handleSubscribe(user._id);
    setLoadingUnFollow(false);
  };

  return (
    <>
      {edit ? (
        <div className="flex items-center gap-3">
        <div
        className={`px-3 py-1 -mb-1 bg-gray-500 hover:bg-gray-600 rounded-full text-c-white transition-colors duration-200 cursor-pointer`}
        onClick={toggleModal}
        >
        Edit Profile
        </div>
        <GhostMode user={user} fetchUserById={fetchUserById} />
        </div>
      ) : isFollow ? (
        <div
          onClick={handleUnFollowBtnClicked}
          disabled={loadingUnFollow}
          className="mx- px-3 py-1 -mb-1  bg-gray-500 hover:bg-gray-600 rounded-lg text-c-white transition-colors duration-200 cursor-pointer"
        >
          {loadingUnFollow ? (
            <LoaderW className="w-[24px] mx-auto" />
          ) : (
            "Unfollow"
          )}
        </div>
      ) : (
        <div
          onClick={handleFollowBtnClicked}
          disabled={loadingFollow}
          className="px-3 py-1 -mb-1   bg-gray-500 hover:bg-gray-600 rounded-lg text-c-white transition-colors duration-200 cursor-pointer"
        >
          {loadingFollow ? <LoaderW className="w-[24px] mx-auto" /> : "Follow"}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-60 z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md mx-2 w-full p-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold">Update Information</h2>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-main-color transition"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-[15px] font-semibold mb-2">
                  Select the fields you want to edit:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleField("name")}
                    className={`px-3 py-1 rounded ${
                      fields.includes("name")
                        ? "bg-main-color text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Name
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleField("email")}
                    className={`px-3 py-1 rounded ${
                      fields.includes("email")
                        ? "bg-main-color text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleField("password")}
                    className={`px-3 py-1 rounded ${
                      fields.includes("password")
                        ? "bg-main-color text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Password
                  </button>
                </div>
              </div>
              {fields.includes("name") && (
                <InputForm
                  labelName="Name"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  condition={false}
                  onBlur={null}
                  errorMessage={null}
                />
              )}
              {fields.includes("email") && (
                <InputForm
                  labelName="Email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  condition={false}
                  onBlur={null}
                  errorMessage={null}
                />
              )}
              {fields.includes("password") && (
                <PasswordForm
                  labelName="New Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  PasswordLight={values.password.length}
                  condition={false}
                  onBlur={null}
                  errorMessage={null}
                />
              )}
              {fields.length > 0 && (
                <PasswordForm
                  labelName="Current Password"
                  name="currentPassword"
                  value={values.currentPassword}
                  onChange={handleChange}
                  PasswordLight={values.currentPassword.length}
                  condition={false}
                  onBlur={null}
                  errorMessage={null}
                />
              )}

              <ButtonForm
                title={"Update your data"}
                loading={statusUpdate === "loading"}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UserInformation;
