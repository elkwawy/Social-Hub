import Cookies from "js-cookie";
import React, { memo, useEffect, useRef, useState } from "react";
import { IoCopy, IoExit } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMessages, sendMessage } from "../../../Redux/slices/chatSlice";
import { reorderChatsWhenSend } from "../../../Redux/slices/userChats";
import { getMsgDateFormatted } from "../../../Utils/getMsgDateFormatted";
import Loader from "./../../../Utils/Loader";
const ChatScreen = memo(({ chat, setSelectedChat, setIsOpenSidebar }) => {
  const [message, setMessage] = useState("");
  const chatScreenRef = useRef(null);
  const userId = Cookies.get("userID");
  const { user } = useSelector((state) => state.user);
  const [groupedMessages, setGroupedMessages] = useState({});
  const { messages, newMessages, loading, error } = useSelector((state) => state.chat);

  
  const dispatch = useDispatch()
  useEffect(() => {
    if (chat?._id) { 
      dispatch(fetchMessages(chat._id));
    }
  }, [chat._id, dispatch]);

  const handleSendMessage = (receiverId) => {
    dispatch(
      sendMessage({
        message,
        userId,
        senderImg: user?.profilePicture,
        senderName: user?.name,
        receiverId,
      })
    );
  };

  const handleSubmitMsg = (e) => {
    e.preventDefault();
    handleSendMessage(chat?._id);
    setMessage("");
    dispatch(reorderChatsWhenSend({ message: message, id: chat?._id }));
  };

  const groupMessagesByDate = (messages) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const grouped = messages.reduce((acc, msg) => {
      const msgDate = new Date(msg.timestamp);
      let formattedDate;

      if (msgDate.toDateString() === today.toDateString()) {
        formattedDate = "Today";
      } else if (msgDate.toDateString() === yesterday.toDateString()) {
        formattedDate = "Yesterday";
      } else {
        formattedDate = msgDate.toLocaleDateString();
      }

      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(msg);
      return acc;
    }, {});

    setGroupedMessages(grouped);
  };

  useEffect(() => {
    if (messages.length)
      groupMessagesByDate(messages);
  }, [chat?._id, messages]); // Trigger re-grouping when `messages` changes


  useEffect(() => {
    if (chatScreenRef.current) {
      chatScreenRef.current.scrollTo({
        top: chatScreenRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, groupedMessages]);

  const handleCopy = (Massage) => {
    const textToCopy = Massage;
    navigator.clipboard.writeText(textToCopy);
  };

  console.log(chat);
  

  return (
    <div className="flex flex-col w-full bg-gray-50">
      {/* Title */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <Link
          to={`/socialHub/profile/${chat?._id}`}
          className="text-lg font-semibold"
        >
          {chat?.name}
        </Link>
        <button>
          <IoExit
            onClick={() => {
              setSelectedChat(null);
              setIsOpenSidebar(true);
            }}
            className="text-2xl text-gray-600 cursor-pointer"
          />
        </button>
      </div>

      {/* Msgs area */}
      <div
        ref={chatScreenRef}
        className="flex-1 overflow-x-hidden overflow-y-auto p-4 space-y-4 chatScreen"
      >
        {loading && (
          <div className="flex items-center h-[467px] justify-center py-4">
            <Loader />
          </div>
        )}

        {!loading &&
          Object.keys(groupedMessages).map((date) => (
            <div key={date} className="space-y-2">
              <div className="text-center text-sm p-2 rounded-md bg-white w-fit mx-auto text-black my-2">
                {date}
              </div>
              {groupedMessages[date].map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs break-words px-4 py-2 rounded-lg text-white relative ${
                      msg.senderId === userId ? "bg-main-color" : "bg-gray-400"
                    }`}
                  >
                    <IoCopy
                      size={12}
                      onClick={() => handleCopy(msg.content)}
                      className={`absolute top-1 ${msg.senderId === userId ? "right-1" : "left-1"} cursor-pointer`}
                    />
                    {msg.content}
                    <span className="block text-right text-xs text-gray-200 mt-1">
                      {getMsgDateFormatted(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Typing area */}
      <form
        onSubmit={handleSubmitMsg}
        className="flex items-center p-4 border-t border-gray-300"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-white msg-area break-words max-w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-400 resize-none overflow-y-auto"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="submit"
          value="Send"
          className="ml-3 px-4 py-2 bg-main-color text-white rounded-md cursor-pointer hover:bg-sec-color"
        />
      </form>
    </div>
  );
});

export default ChatScreen;
