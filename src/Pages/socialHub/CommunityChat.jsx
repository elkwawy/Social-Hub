import axios from "axios";
import Cookies from "js-cookie";
import React, { memo, useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { Img } from "react-image";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API } from "../../Api/Api";
import { getMsgDateFormatted } from "../../Utils/getMsgDateFormatted";
import Loader from "../../Utils/Loader";
import { isValidUrl } from "../../Utils/validateURLs";
import Skeleton from "react-loading-skeleton";
import { showToast } from "../../Utils/showToast";
import Error from "../../Utils/Error";
import socket, { joinCommunity } from "../../Utils/socket";
import checkImg from "../../Utils/checkImg";
import { groupMessagesByDate } from "../../Utils/date/groupMsgsByDate";
const CommunityChat = memo(() => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const chatScreenRef = useRef(null);
    const userId = Cookies.get("userID");
    const { user } = useSelector((state) => state.user);
    const [groupedMessages, setGroupedMessages] = useState({});
    const loc = useLocation();
    const communityName = loc.state?.communityName || "";
    const members = loc.state?.members || "";
    
    const {id} = useParams();
    
    useEffect(() => {
        const getMsgs = async () => { 
            try {
                setLoading(true);
                const res = await axios.get(`${API.getGroupMessages}?groupId=${id}`);
                console.log(res.data);
                setMessages(res.data.messages);
            } catch (error) {
                setLoading(false);
                console.log(error);
                setError(error?.response?.data?.message || "Something went wrong with fetching messages")
            }finally { 
                setLoading(false);
            }
        }
        if (id) { 
            getMsgs();
        }
    }, [id]);

    const handleSendMessage = async () => {
        try {
            await axios.post(`${API.sendGroupMessage}`, {content:message, communityId: id, senderId:userId});
        } catch (error) {
            showToast("error", error?.response?.data?.message || "Something went wrong with sending message");
        }
    };
    

    const handleSubmitMsg = (e) => {
        e.preventDefault();
        console.log("called");
        
        if (user) { 
            const msg = {
                content: message,
                senderId: userId,
                senderName: user?.name,
                communityId:id,
                senderProfilePicture: user?.profilePicture,
                timestamp: new Date(),
                isRead: false,
                type:"community"
            }
            setMessages((prevMessages) => prevMessages.length > 0 ? [...prevMessages, msg] : [msg]);
            handleSendMessage();
            socket.emit("send-community-message", {...msg});
            setMessage("");
        }
    };

    useEffect(() => {
        const handleConnect = () => {
        if (id) {
            console.log("Socket connected. Emitting join-community event.");
            joinCommunity(id);
        }
        };

        // Listen for the "connect" event
        socket.on("connect", handleConnect);

        // Join the community if the socket is already connected
        if (socket.connected && id) {
        joinCommunity(id);
        }

        // Clean up the event listener on unmount
        return () => {
        socket.off("connect", handleConnect);
        };
    }, [id, socket.connected]);

    useEffect(() => {
        const handleMsgReceive = (data) => {
            console.log("done", data);
            if (data.senderId !== userId) 
                setMessages((prevMessages) => [...prevMessages, data]);
        };

        // Listen for the "community-message-received" event
        socket.on("community-message-received", handleMsgReceive);

        // Clean up the event listener on unmount
        return () => {
            socket.off("community-message-received", handleMsgReceive);
        };
    }, [socket, id]);
    

    useEffect(() => {
        if (messages.length) { 
            const grouped = groupMessagesByDate(messages);
            setGroupedMessages(grouped);
        }
    }, [id, messages]); 


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

    const nav = useNavigate()
    const navToUser = (id) => { 
        nav(`/socialHub/profile/${id}`);
    }

    return (
        <div className="flex flex-col w-full overflow-hidden h-[calc(100vh-123px)] bg-gray-50">
        {/* Title */}
        <div className="flex flex-col gap-1  justify-center pb-4 border-b border-gray-300">
            <p
            className="text-xl font-semibold"
            >
                {communityName}
            </p>

            {/* Members */}
            {members && <div className="flex gap-0.5">
                {
                    members.map((member, index) => (
                        <p className="text-gray-500 text-xs">
                            {member.name}
                            {index !== members.length - 1 && `,`}
                        </p>
                    ))
                }
            </div>}
        </div>

        {/* Msgs area */}
        <div
            ref={chatScreenRef}
            className="flex-1 overflow-x-hidden  overflow-y-auto pb-4 space-y-4 chatScreen"
        >
            {loading && (
            <div className="flex items-center h-[467px] justify-center py-4">
                <Loader />
            </div>
            )}

            {!loading && !error &&
                (
                    messages.length > 0 ? 
                    (
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
                            <div className={`flex ${msg.senderId === userId ? "flex-row-reverse" : "flex-row"} gap-2`}>
                                {
                                        msg.senderProfilePicture && isValidUrl(msg.senderProfilePicture) && checkImg(msg.senderProfilePicture)
                                        ? <Img src={msg.senderProfilePicture} className='w-8 h-8 rounded-full' loader={<div className='w-10 h-10 rounded-full'><Skeleton width={'100%'} height={'100%'} borderRadius={'100%'} /></div>} />
                                        : <FaUserCircle className="text-gray-300 w-9 h-9" />
                                    }
                                <div
                                    className={`max-w-xs break-words px-4 py-2 rounded-lg text-white relative ${
                                    msg.senderId === userId ? "bg-main-color" : "bg-gray-400"
                                    }`}
                                >
                                    <IoCopy
                                    size={10}
                                    onClick={() => handleCopy(msg.content)}
                                    className={`absolute top-1 ${msg.senderId === userId ? "right-1" : "left-1"} cursor-pointer`}
                                    />
                                    <div className="flex items-center mt-1 gap-1">
                                        <button onClick={() => navToUser(msg.senderId)} title={msg.senderName} className="text-sm font-semibold">
                                            {msg.senderName.length > 13 ? msg.senderName.slice(0,10) + "..." : msg.senderName}
                                        </button>
                                    </div>
                                    <span className="text-gray-100">{msg.content}</span>
                                    <span className="block text-right text-xs text-gray-200 mt-1">
                                    {getMsgDateFormatted(msg.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                )))
                :
                    <Error error={"No messages sent"} />
                )
            }
            
            {
                error && 
                <div className="text-center flex items-center justify-center h-full">
                    <Error error={error} />
                </div>
            }
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

export default CommunityChat;