import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  getUserById,
  subscribe,
  unsubscribe,
  addFriend,
  acceptFriend,
  rejectFriend,
  updateUser,
  searchByName,
  blockUser,
  unBlockUser,
} from "../Redux/slices/usersSlice";

export const useUsers = () => {
  const dispatch = useDispatch();
  const { users, userData, status, error, statusUpdate } = useSelector(
    (state) => state.users
  );

  const fetchAllUsers = () => {
    dispatch(getAllUsers());
  };

  const fetchUserById = (userId) => {
    return dispatch(getUserById(userId)).unwrap();
  };

  const handleSubscribe = (userId) => {
    return dispatch(subscribe(userId)).unwrap();
  };

  const handleUnsubscribe = (userId) => {
    return dispatch(unsubscribe(userId)).unwrap();
  };

  const handleAddFriend = (friendId) => {
    return dispatch(addFriend(friendId));
  };

  const handleAcceptFriend = (senderId) => {
    return dispatch(acceptFriend({ senderId })).unwrap();
  };
  const handleRejectFriend = (senderId) => {
    return dispatch(rejectFriend({ senderId })).unwrap();
  };

  const handleUpdateUser = (userId, values) => {
    return dispatch(updateUser({ userId, values })).unwrap();
  };

  const handleSearchByName = (query) => {
    dispatch(searchByName(query));
  };

  const blockUsers = (payload) => {
    return dispatch(blockUser(payload)).unwrap(); 
  };
  
  const unBlockUsers = (payload) => {
    return dispatch(unBlockUser(payload)).unwrap(); 
  };

  return {
    users,
    userData,
    status,
    error,
    statusUpdate,
    fetchAllUsers,
    fetchUserById,
    handleSubscribe,
    handleUnsubscribe,
    handleAddFriend,
    handleAcceptFriend,
    handleRejectFriend,
    handleUpdateUser,
    handleSearchByName,
    blockUsers,
    unBlockUsers,
  };
};
