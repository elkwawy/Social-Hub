import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ChatScreen from "../../Components/socialHub/Messages/ChatScreen";
import ChatSidebar from "../../Components/socialHub/Messages/ChatSidebar";
import { pushNewMessageToUnReadMessages, receiveMessage } from "../../Redux/slices/chatSlice";
import { reorderChatsWhenReceive } from "../../Redux/slices/userChats";
import socket from "../../Utils/socket";

const MyMessages = () => {
  const loc = useLocation();
  const friend = loc.state?.friend || null;
  const [selectedChat, setSelectedChat] = useState(friend);
  const [isOpenSidebar, setIsOpenSidebar] = useState(true);

  useEffect(() => {
    if (friend) {
      setSelectedChat(friend);
    }
  }, [friend]);

  const dispatch = useDispatch();
  const handleChangeSelectedChat = (chat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    const handleMsgReceive = (newMessage) => {
      console.log("Selected Chat:", selectedChat);

      if (selectedChat && selectedChat._id === newMessage.senderId) {
        dispatch(receiveMessage(newMessage));
      }

      dispatch(pushNewMessageToUnReadMessages(newMessage))
      
      const sender = {
        senderId: newMessage.senderId,
        receiverName: newMessage.senderName,
        receiverProfilePicture: newMessage.senderImg,
        content: newMessage.msg,
      };
      dispatch(reorderChatsWhenReceive(sender));
    };
    
    // Listen for events
    socket.on("msg-recieve", handleMsgReceive);
    
    return () => {
      socket.off("msg-recieve", handleMsgReceive);
    };
  }, [dispatch, selectedChat, socket]);

  return (
    <div className="flex w-[calc(100%+48px)] -m-6 h-[calc(100vh-74px)] border border-gray-100 bg-gray-100">
      {/* Chat Screen */}
      <div className="flex flex-1">
        {selectedChat ? (
          <ChatScreen
            chat={selectedChat}
            setSelectedChat={setSelectedChat}
            setIsOpenSidebar={setIsOpenSidebar}
          />
        ) : (
          <div className="flex items-center max-[500px]:hidden justify-center w-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
      {/* Sidebar */}
      <ChatSidebar
        setSelectedChat={handleChangeSelectedChat}
        friendChat={friend}
        setIsOpenSidebar={setIsOpenSidebar}
        isOpenSidebar={isOpenSidebar}
      />
    </div>
  );
};

export default MyMessages;
