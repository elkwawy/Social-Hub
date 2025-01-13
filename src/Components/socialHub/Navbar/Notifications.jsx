import { useState, useRef, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { formatDate } from "../../../Utils/formatDate";
import NotificationsHook from "../../../Hooks/NotificationsHook";
import Loader from "../../../Utils/Loader";
import { socket } from "../../../Pages/socialHub/SocialHubLayout";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  const {
    notifications,
    unreadNotifications,
    loadingGeneral,
    loadingNotifications,
    fetchNotifications,
    fetchUnreadNotifications,
    markAllAsRead,
  } = NotificationsHook();

  const [expandedMessages, setExpandedMessages] = useState({});

  // useEffect(() => {
  //   if (!socket) { 
  //     console.log("NO socket");
  //     return;
  //   }
  //     // Listener for new notifications
  //     console.log("Enter Noti");
      
  //     socket.on("new-notification", (notification) => {
  //       console.log("Entering");
  //       console.log("New Notification:", notification);
  //       // Handle the notification (e.g., show a toast, update state, etc.)
  //     });
  
  //     return () => {
  //       socket.off("new-notification"); // Cleanup the event listener when component unmounts
  //     };
  //   }, []);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchUnreadNotifications();
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUnreadNotifications();
  }, [unreadNotifications.length]);

  const toggleExpandMessage = (id) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const truncateMessage = (message, length) => {
    return message.length > length ? message.slice(0, length) + "..." : message;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Icon with Notification Count */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-800 relative mt-2"
      >
        <FaBell size={20} />
        <span className="absolute -top-1.5 -right-1.5 bg-main-color text-white text-xs rounded-full w-[18px] h-[18px] flex items-center justify-center">
          {unreadNotifications?.length}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute -right-3.5 mt-2 w-[260px] sm:w-[400px] bg-c-bg1 rounded shadow-2xl z-50">
          {/* Arrow pointing to the button */}
          <div className="absolute -top-1.5 right-4 w-4 h-4 bg-main-color rotate-45 -z-40"></div>
          <div className="flex items-center bg-c-white justify-between space-x-2 px-3 py-2 border-b-2 border-h-bg1">
            <h2 className="text-lg font-bold text-c-black">Notifications</h2>
            <FaTimes
              className="text-red-500 bg-c-white text-lg cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="max-h-[262px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Show loader while fetching data */}
            {loadingGeneral ? (
              <div className="flex justify-center items-center py-4">
                <Loader width={"30px"} />
              </div>
            ) : unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex items-start border-b border-h-bg1 px-4 py-2 hover:bg-c-bg2"
                >
                  <div className="space-y-1">
                    <p className="text-c-black font-semibold text-sm">
                      {expandedMessages[notification._id]
                        ? notification.message
                        : truncateMessage(notification.message, 120)}
                      {notification.message.length > 120 && (
                        <button
                          onClick={() => toggleExpandMessage(notification._id)}
                          className="text-sec-colortext-sm ml-2"
                        >
                          {expandedMessages[notification._id]
                            ? "Show Less"
                            : "Show More"}
                        </button>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              !notifications.notifications &&
              !notifications.message && (
                <div className="text-center py-4 text-gray-500 ">
                  There are no new notifications.
                </div>
              )
            )}

            {loadingNotifications ? (
              <div className="flex justify-center h-[262px] items-center">
                <Loader width={"50px"} />
              </div>
            ) : notifications.notifications ? (
              <div className="border-t py-4">
                <h4 className="text-base font-bold text-main-color pb-1 px-4">
                  Old Notifications
                </h4>
                {notifications.notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-start border-b border-h-bg1 px-4 py-2 hover:bg-c-bg2"
                  >
                    <div className="space-y-1">
                      <p className="text-c-black font-semibold text-sm">
                        {expandedMessages[notification._id]
                          ? notification.message
                          : truncateMessage(notification.message, 120)}
                        {notification.message.length > 120 && (
                          <button
                            onClick={() => toggleExpandMessage(notification._id)}
                            className="text-sec-color text-sm ml-2"
                          >
                            {expandedMessages[notification._id]
                              ? "Show Less"
                              : "Show More"}
                          </button>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`text-center text-sm ${
                  notifications.message && " py-4 border-t"
                } text-gray-500`}
              >
                {notifications.message}
              </div>
            )}
          </div>
          <div className="flex justify-between text-white font-semibold ">
            <button
              onClick={fetchNotifications}
              className="px-4 py-2 text-sm w-1/2 border-r  bg-sec-color hover:bg-main-color"
            >
              Show old notifications
            </button>
            <button
              onClick={handleMarkAllAsRead}
              disabled={
                unreadNotifications.length === 0 || loadingNotifications
              }
              className={`px-4 py-2 text-sm w-1/2 bg-sec-color hover:bg-main-color ${
                (unreadNotifications.length === 0 || loadingNotifications) &&
                "bg-red-600 cursor-not-allowed"
              }`}
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;