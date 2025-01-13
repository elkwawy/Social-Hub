import { FriendRequest } from "./FriendRequest";
import { FriendCard } from "./FriendCard";
import { useOutletContext } from "react-router-dom";
import ItemsCarousel from "./FriendReCarousel";
import Loader from "../../../../Utils/Loader";
import axios from "axios";
import { API } from "../../../../Api/Api";
import { useEffect, useState } from "react";

export default function Friends() {
  const { user, edit, loading } = useOutletContext();
  const [friendRequests, setFriendRequests] = useState([]);
  const [blockedFriends, setBlockedFriends] = useState([]);
  const [unblockedFriends, setUnblockedFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const getUserFriendsInfo = async () => {
    setLoadingFriends(true);
    try {
      const response = await axios.get(`${API.getUserFriendsInfo}/${user._id}`);
      const allFriends = response.data.friends;
      setBlockedFriends(allFriends.filter((friend) => friend.isBlocked));
      setUnblockedFriends(allFriends.filter((friend) => !friend.isBlocked));
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoadingFriends(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFriendRequests(user.friendRequests);
      getUserFriendsInfo();
    }
  }, [user]);
  

  const handleFriendRequestAction = (friend, actionType) => {
    if (actionType === "reject") {
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.sender !== friend.sender)
      );
    }
    if (actionType === "accept") {
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.sender !== friend.friendId)
      );

      setUnblockedFriends((prevFriends) => [...prevFriends, friend]);
    }
  };

  // دالة نقل الصديق بين القوائم
  const handleFriendAction = (friend, actionType) => {
    if (actionType === "block") {
      // إزالة من غير المحظورين وإضافة للمحظورين
      setUnblockedFriends((prev) =>
        prev.filter(
          (unblockedFriend) => unblockedFriend.friendId !== friend.friendId
        )
      );
      setBlockedFriends((prev) => [...prev, { ...friend, isBlocked: true }]);
    } else if (actionType === "unblock") {
      // إزالة من المحظورين وإضافة لغير المحظورين
      setBlockedFriends((prev) =>
        prev.filter(
          (blockedFriend) => blockedFriend.friendId !== friend.friendId
        )
      );
      setUnblockedFriends((prev) => [...prev, { ...friend, isBlocked: false }]);
    }
  };

  if (!user || loading || loadingFriends) {
    return (
      <div className={`w-full flex items-center justify-center mt-32`}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 mb-32">
      {edit && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
          <ItemsCarousel
            items={friendRequests}
            CardComponent={FriendRequest}
            message={"No friend requests at the moment."}
            handleFriendRequestAction={handleFriendRequestAction}
          />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">
          {edit ? "Your Friends" : "Friends"}
        </h2>
        {unblockedFriends.length === 0 ? (
          <div className="w-full mt-14 text-center flex items-center flex-col gap-3">
            <h1 className="text-gray-500 text-2xl font-semibold">
              No friends found.
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {unblockedFriends.map((friend) => (
              <FriendCard
                key={friend.friendId}
                friend={friend}
                edit={edit}
                onAction={(type) => handleFriendAction(friend, type)}
                unblock={false}
              />
            ))}
          </div>
        )}
      </div>

      {blockedFriends.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            {edit ? "Blocked Friends" : "Restricted Friends"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blockedFriends.map((friend) => (
              <FriendCard
                key={friend.friendId}
                friend={friend}
                edit={edit}
                onAction={(type) => handleFriendAction(friend, type)}
                unblock={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
