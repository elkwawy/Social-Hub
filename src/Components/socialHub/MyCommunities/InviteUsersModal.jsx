import axios from 'axios';
import React, { memo, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { API } from '../../../Api/Api';
import Modal from '../../../Utils/Modal';
import UserToInvite from './UserToInvite';
import { showToast } from '../../../Utils/showToast';
import Loader from '../../../Utils/Loader';

const InviteUsersModal = memo(({ community, followersArr, followedArr, onClose }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(true);
    
    // Fetch users on mount
    useEffect(() => {
        const getAllUsers = async () => {
            setLoadingUsers(true);
            try {
                if (followersArr.length === 0 && followedArr.length === 0) { 
                    setError("You don't have friends to invite");
                    return;
                }
                
                const followers = followersArr?.map((followerId) => 
                    axios.get(`${API.getUserById}/${followerId}`).then((response) => response.data)
                ) || [];
                
                const followed = followedArr?.map((followedId) =>
                    axios.get(`${API.getUserById}/${followedId}`).then((response) => response.data)
                ) || [];
                
                const usersArray = await Promise.all([...followers, ...followed]);

                // Remove duplicates based on user ID
                const uniqueUsers = Array.from(
                    new Map(usersArray.map(user => [user._id, user])).values()
                );

                setUsers(uniqueUsers);
            } catch (error) {
                if (error && error.response && error.response.data && error.response.data.message) { 
                    setError(error.response.data.message);
                    showToast('error', error.response.data.message);
                } else {
                    setError(error.message);
                }
            } finally { 
                setLoadingUsers(false);
            }
        };
        getAllUsers();
    }, [followersArr, followedArr]);

    // Memoize the rendered user list
    const MemoizedUserList = useMemo(() => {
        // Create a Set of community member IDs for quick lookups
        const memberSet = new Set(community?.members.map(member => member._id) || []);
        return <div className='flex flex-col gap-5 px-1'>
            {users
                .filter((user) => user != null && !memberSet.has(user._id)) // Exclude users who are already members
                .map((user) => (
                    <UserToInvite key={user._id} user={user} communityId={community?._id} />
                ))}
        </div>;
    }, [users, community]);


    return (
        <Modal title={`Invite Users ${community ? 'to ' + community.name : ''}`} onClose={onClose}>
        {loadingUsers ? (
            <div className=' w-full flex items-center justify-center h-44'>
                <Loader width={'30px'} />
            </div>
        ) : ( !error ? MemoizedUserList : <p className='w-full flex items-center justify-center  sm:text-lg text-gray-500 '>{error}</p>
        )}
        </Modal>
    );
});

export default InviteUsersModal;
