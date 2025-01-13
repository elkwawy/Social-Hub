import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import { API } from '../../../Api/Api';
import Loader from '../../../Utils/Loader';
import { showToast } from '../../../Utils/showToast';
import { Img } from 'react-image';

const UserToInvite = memo(({ user, communityId }) => {
    // Redux selectors and dispatch
    const [loading, setLoading] = useState(false);
    const [inviteSent, setInviteSent] = useState(false);
    const [pendingUser, setPendingUser] = useState(false)
    const [inviteLoading, setinviteLoading] = useState(false)

    // Fetch user data
    const handleInviteUser = async () => {
        try {
            setinviteLoading(true)
            const res = await axios.post(`${API.inviteToCommunity}`, {
                communityId: communityId,
                userId: user._id,
            });
            if (res.data.message == "Invitation sent successfully") {
                showToast("success", `Invitation sent to ${user.name}`);
                setInviteSent(true)
            }
        } catch (error) {
            showToast("error", error.response?.data?.message || "Something went wrong");
            setinviteLoading(false);
        } finally { 
            setinviteLoading(false);
        }
    };

    useEffect(() => { 
        const hasPendingInvitation = user?.invitations?.some(
            (c) => (c.communityId === communityId) && !c.accepted
        );
        if (hasPendingInvitation) {
            setPendingUser(true);
        } else { 
            setPendingUser(false);
        }
    }, [communityId]);

    return (
        <>
            {loading && (
                <div className="w-fit flex items-center gap-1">
                    <div className="w-10 h-10 rounded-full">
                        <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                    </div>
                    <div className="w-24 h-6 rounded-sm">
                        <Skeleton height="100%" width="100%" borderRadius={"3px"} />
                    </div>
                </div>
            )}
            {!loading && user &&  (
                <div className="flex gap-1 w-full justify-between items-center">
                    <div className="flex items-center justify-center gap-1">
                        {user && user.profilePicture ? (
                            <Img
                                className="min-w-10 max-w-10 h-10 rounded-full"
                                src={user.profilePicture}
                                loader={
                                    <div className="w-10 h-10 rounded-full">
                                        <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                                    </div>
                                }
                            />
                        ) : (
                            <FaUserCircle className="text-gray-300 w-10 h-10" />
                        )}
                        <p className="text-sm text-gray-600">
                            {user.name.length > 20 ? user.name.slice(0, 20) + "..." : user.name}
                        </p>
                    </div>
                    {!inviteLoading && !pendingUser && !inviteSent &&  <button
                        onClick={handleInviteUser}
                        className={` text-xs bg-main-color text-white hover:bg-sec-color trans px-5 py-2 ml-5 rounded-md `}
                    >
                        Invite
                    </button>}
                    {(pendingUser || inviteSent) && <button className="select-none text-white pointer-events-none text-xs bg-red-300 px-3 py-2 ml-5 rounded-md ">Pending</button>}
                    {inviteLoading && <div className='px-3'><Loader width={'30px'} /></div>}
                </div>
            )}
        </>
    );
}, (prevProps, nextProps) => {
    // Prevent unnecessary re-renders by comparing props
    return prevProps.user._id === nextProps.user._id && prevProps.communityId === nextProps.communityId;
});

export default UserToInvite;
