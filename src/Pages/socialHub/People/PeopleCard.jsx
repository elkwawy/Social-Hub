import React, { useEffect, useState } from "react";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { BsPersonCheckFill } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import profile from "../../../assets/profile.jpg";
import { Link } from "react-router-dom";
import { useUsers } from "../../../Hooks/useUsers";
import { API } from "../../../Api/Api";
import axios from "axios";
import { isValidUrl } from "../../../Utils/validateURLs";
import LoaderW from "../../../Utils/loaderW";
import { Img } from "react-image";
import checkImageUrl from "../../../Utils/checkImageUrl";
import Skeleton from "react-loading-skeleton";
const PeopleCard = ({ person }) => {
  const { handleSubscribe, handleUnsubscribe, handleAddFriend, error } =
    useUsers();
  const [isFollow, setIsFollow] = useState(person?.youFollow || false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingUnFollow, setLoadingUnFollow] = useState(false);
  const [didSendRequest, setDidSendRequest] = useState(
    person?.sendFriendRequest || false
  );

  useEffect(() => {
    if (error) {
      setIsFollow(person.youFollow);
      setDidSendRequest(person.sendFriendRequest);
    }
  }, [error]);

  const handleUnFollowBtnClicked = async () => {
    setLoadingUnFollow(true);
    await handleUnsubscribe(person._id);
    setIsFollow(false);
    setLoadingUnFollow(false);
  };

  const handleFollowBtnClicked = async () => {
    setLoadingFollow(true);
    await handleSubscribe(person._id);
    setIsFollow(true);
    setLoadingFollow(false);
  };
  const handleAddFriendBtnClicked = () => {
    setDidSendRequest(true);
    handleAddFriend(person._id);
  };

  const [matualFriends, setMatualFriends] = useState([]);
  const getMutualFriends = async () => {
    try {
      const response = await axios.get(`${API.getMutualFriends}/${person._id}`);
      setMatualFriends(response.data);
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          "Something went wrong with fetching mutual friends."
      );
    }
  };

  useEffect(() => {
    getMutualFriends();
  }, [person._id]);

  const checkImg = async (url) => {
      await checkImageUrl(url).then((isValid) => {
        if (isValid) {
          return true;
        } else {
          return false;
        }
      });
    };
    console.log(person.profilePicture);
  return (
    <div className="flex items-center max-[540px]:flex-col max-[540px]:gap-2 p-5 bg-gray-100 shadow border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-200">
      {/* صورة المستخدم */}
      <Link to={`/socialHub/profile/${person._id}`}>
        {(person.profilePicture &&  isValidUrl(person.profilePicture) && checkImg(person.profilePicture)) ? 
        <Img
          src={person.profilePicture}
          alt={person.name}
          className="w-[96px] h-[96px] rounded-full"
          loader={
            <div className="w-[96px] h-[96px] rounded-full">
              <Skeleton
                height="100%"
                width="100%"
                borderRadius={"100%"}
              />
            </div>
          }
        />
        :
        <Img
          src={profile}
          alt={person.name}
          className="w-[96px] h-[96px] rounded-full"
          loader={
            <div className="w-[96px] h-[96px] rounded-full">
              <Skeleton
                height="100%"
                width="100%"
                borderRadius={"100%"}
              />
            </div>
          }
        />

      }
      </Link>

      {/* بيانات المستخدم */}
      <Link
        to={`/socialHub/profile/${person._id}`}
        className="ml-4 flex-1 space-y-1"
      >
        <h2 className="text-xl font-bold text-gray-800">{person.name}</h2>
        <p className="text-sm text-gray-600">
          {matualFriends.length} Mutual Friends
        </p>
      </Link>

      {/* أزرار الإجراءات */}
      <div className="ml-4 flex flex-col max-[540px]:flex-row max-[365px]:flex-col items-end gap-2">
        {/* زر المتابعة/إلغاء المتابعة */}
        <button
          onClick={isFollow ? handleUnFollowBtnClicked : handleFollowBtnClicked}
          disabled={isFollow ? loadingUnFollow : loadingFollow}
          className="px-4 py-2 bg-sec-color text-white hover:bg-main-color rounded-lg flex items-center transition"
        >
          {isFollow ? (
            loadingUnFollow ? (
              <LoaderW className="w-[24px] mx-auto" />
            ) : (
              <>
                <SlUserUnfollow className="mr-2" />
                Unfollow
              </>
            )
          ) : loadingFollow ? (
            <LoaderW className="w-[24px] mx-auto" />
          ) : (
            <>
              <SlUserFollow className="mr-2" />
              Follow
            </>
          )}
        </button>

        {/* زر إرسال طلب صداقة */}
        {didSendRequest ? (
          <button
            className="px-[5px] py-2 bg-gray-500 cursor-not-allowed text-white rounded-lg flex items-center transition"
            disabled
          >
            <BsPersonCheckFill className="mr-1" />
            Request Sent
          </button>
        ) : (
          <button
            onClick={handleAddFriendBtnClicked}
            className="px-2.5 py-2 bg-gray-400 text-white rounded-lg flex items-center transition "
          >
            <FaUserPlus className="mr-2" />
            Add Friend
          </button>
        )}
      </div>
    </div>
  );
};

export default PeopleCard;
