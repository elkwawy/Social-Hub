import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { getCurrUser } from "../../Redux/slices/userSlice";
import socket from "../../utils/socket";
import PersistentLayout from "./PersistentLayout";
// export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
// export const socket = io(SOCKET_URL);


const SocialHubLayout = () => {
  const dispatch = useDispatch();
  const userID = Cookies.get("userID");
  useEffect(() => {
    // socket = io(SOCKET_URL); // Initialize socket

    if (userID) {
      dispatch(getCurrUser(userID));
      // Emit the "add-user" event with the logged-in user's ID
      socket.emit("add-user", userID);
      console.log("User ID sent to server:", userID);
    }
    
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log(err);
    });
    
  }, [userID]);

  

  return (
    <PersistentLayout>
      <Outlet />
    </PersistentLayout>
  );
};

export default SocialHubLayout;