import { useEffect, useState } from "react";
import { API } from "../../../Api/Api";
import axios from "axios";
import { Link } from "react-router-dom";
import { showToast } from "../../../Utils/showToast";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import profile from "../../../assets/profile.jpg";
import { isValidUrl } from "../../../Utils/validateURLs";

const CommunityRequests = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch community requests
  const fetchCommunityRequests = async () => {
    try {
      const response = await axios.get(API.getCommunityRequests);
      setInvitations(response.data.myInvitations);
    } catch (error) {
      console.error("Error fetching community requests:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(invitations);
  
  // Accept invitation
  const handleAcceptInvitation = async (communityId) => {
    const copyInvitations = [...invitations];
    setInvitations((prev) =>
      prev.filter((inv) => inv.communityId !== communityId)
    );
    try {
      await axios.post(API.acceptInvitation, { communityId: communityId });
      showToast("success", "Invitation accepted successfully");
      console.log("Invitation accepted successfully");
    } catch (error) {
      setInvitations(copyInvitations);
      showToast("error", "Something went wrong");
      console.error("Error accepting invitation:", error);
      console.log("Error accepting invitation:", error);
    }
  };

  // Ignore invitation
  const handleIgnoreInvitation = async (invitationId) => {
    const copyInvitations = [...invitations];
    setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
    try {
      await axios.post(API.ignoreInvitation, {
        invitationId: invitationId,
      });
      showToast("success", "Invitation ignored successfully");
    } catch (error) {
      setInvitations(copyInvitations);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchCommunityRequests();
  }, []);

  const renderSkeleton = () => {
    return (
      <ul className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <li
            key={index}
            className="p-5 bg-gray-100 border border-gray-200 rounded-lg shadow-md flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-4">
              <Skeleton circle={true} height={56} width={56} />
              <div className="flex-1">
                <Skeleton height={16} width="40%" />
                <Skeleton height={14} width="60%" className="mt-2" />
              </div>
            </div>
            <div className="flex space-x-4 justify-center md:justify-end">
              <Skeleton height={30} width={80} />
              <Skeleton height={30} width={80} />
            </div>
          </li>
        ))}
      </ul>
    );
  };
  

  return (
    <div className="mt-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Community Requests</h2>
      {loading ? (
        renderSkeleton()
      ) : invitations.length === 0 ? (
        <p className="mt-2 text-gray-600">No community requests available.</p>
      ) : (
        <ul className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          {invitations.map((invitation) => (
            <li
              key={invitation._id}
              className="p-5 bg-[#f3f4f6] border border-gray-200 rounded-lg shadow-md flex flex-col space-y-4"
            >
              <div className="flex items-center space-x-4">
                <Link
                  to={`/socialHub/profile/${invitation.senderId}`}
                  className="w-14"
                >
                  {(invitation.senderProfilePicture && isValidUrl(invitation.senderProfilePicture)) ? <Img
                    src={invitation.senderProfilePicture}
                    alt={invitation.senderName}
                    className="w-14 h-14 rounded-full border border-gray-300"
                  />
                  : <Img src={profile} className="w-14 h-14 rounded-full border border-gray-300" />
                }
                </Link>
                <div>
                  <Link
                    to={`/socialHub/profile/${invitation.senderId}`}
                    className="text-lg font-semibold text-gray-800 hover:underline"
                  >
                    {invitation.senderName}
                  </Link>
                  <p className="text-sm text-gray-600">
                    invited you to join{" "}
                    <span className="text-lg font-semibold text-main-color">
                      {invitation.communityName}
                    </span>{" "}
                    Community
                  </p>
                </div>
              </div>
              <div className="flex space-x-4 justify-center md:justify-end">
                <button
                  onClick={() => handleIgnoreInvitation(invitation._id)}
                  className="px-6 py-2 hover:bg-gray-50 border border-main-color text-main-color rounded-md"
                >
                  Ignore
                </button>
                <button
                  onClick={() => handleAcceptInvitation(invitation.communityId)}
                  className="px-6 py-2  border border-main-color  bg-main-color text-white rounded-md hover:bg-sec-color"
                >
                  Accept
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommunityRequests;
