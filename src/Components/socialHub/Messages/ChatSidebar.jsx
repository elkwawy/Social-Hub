import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Img } from "react-image";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { getMyChats, setActiveChat } from "../../../Redux/slices/userChats";
import splitTextByLength from "../../../Utils/splitTextByLength";
import { isValidUrl } from "../../../Utils/validateURLs";
import checkImageUrl from "./../../../Utils/checkImageUrl";
import profile from "./../../../assets/profile.jpg";

const ChatSidebar = ({
  setSelectedChat,
  friendChat,
  isOpenSidebar,
  setIsOpenSidebar,
}) => {
  const userId = Cookies.get("userID");
  const { chats, status, error, activeChat, isactive } = useSelector(
    (state) => state.userChats
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyChats(friendChat));
  }, [userId]);

  const handleSetSelectedChat = (contact, index) => {
    const id =
      contact?.receiverId && userId !== contact?.receiverId
        ? contact?.receiverId
        : contact?.senderId && userId !== contact?.senderId
          ? contact?.senderId
          : null;
    let contactSent = {
      _id: id,
      name: contact.receiverName,
    };
    setSelectedChat(contactSent);
    dispatch(setActiveChat(id));
  };

  const checkImg = async (url) => {
    await checkImageUrl(url).then((isValid) => {
      if (isValid) {
        return true;
      } else {
        return false;
      }
    });
  };
  
  return (
    <div
      className={`w-full min-[500px]:w-[45%] md:w-[35%] lg:w-[30%] xl:w-[25%]   bg-white border-l border-gray-300 py-4 ${isOpenSidebar ? "block" : "max-xl:hidden"}`}
    >
      <h1 className="text-xl text-center border-b pb-4 font-bold text-gray-800 mb-4">
        Chats Friends
      </h1>
      {status === "loading" && (
        <div className="w-full h-full ">
          {Array.from({ length: chats.length > 0 ? chats.length : 5 }).map(
            (_, index) => (
              <div key={index} className="flex items-center p-3  gap-3 ">
                <Skeleton height="36px" width="36px" borderRadius={"100%"} />
                <div className=" flex flex-col gap-1">
                  <Skeleton height="20px" width="160px" />
                  <Skeleton height="20px" width="80px" />
                </div>
              </div>
            )
          )}
        </div>
      )}
      {/* chats List */}
      <ul>
        {status == "succeeded" &&
          chats.map((contact) => {
            const chatId =
              contact?.receiverId && userId !== contact?.receiverId
                ? contact?.receiverId
                : contact?.senderId && userId !== contact?.senderId
                  ? contact?.senderId
                  : null;
            if ( contact?.receiverName !=="Unknown Receiver" )
            return (
              <li
                key={chatId}
                className={`flex items-center gap-3 p-3 ${activeChat == chatId && !isOpenSidebar ? "bg-gray-200" : " hover:bg-gray-200"}  trans cursor-pointer `}
                onClick={() => {
                  handleSetSelectedChat(contact);
                  setIsOpenSidebar(false);
                }}
              >
                {contact && contact.receiverProfilePicture ? (
                  checkImg(contact.receiverProfilePicture) ? (
                    <Img
                      className="max-w-9 h-9 rounded-full"
                      src={
                        isValidUrl(contact.receiverProfilePicture)
                          ? contact.receiverProfilePicture
                          : profile
                      }
                      loader={
                        <div className="w-9 h-9 rounded-full">
                          <Skeleton
                            height="100%"
                            width="100%"
                            borderRadius={"100%"}
                          />
                        </div>
                      }
                    />
                  ) : (
                    <FaUserCircle className="text-gray-300 w-9 h-9" />
                  )
                ) : (
                  <FaUserCircle className="text-gray-300 w-9 h-9" />
                )}
                <div className="flex items-start flex-col gap-1">
                  <button
                    title={
                      contact?.receiverName?.length > 16 && contact.receiverName
                    }
                    className="font-semibold text-sm text-gray-700"
                  >
                    {contact?.receiverName?.length > 16
                      ? contact.receiverName.slice(0, 16) + "..."
                      : contact.receiverName}
                  </button>
                  <button
                    title={
                      contact?.content?.length > 22 &&
                      splitTextByLength(contact?.content, 24)
                    }
                    className="text-sm text-gray-500"
                  >
                    {contact?.content?.length > 22
                      ? contact.content.slice(0, 22) + "..."
                      : contact.content}
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ChatSidebar;
