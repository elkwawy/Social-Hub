import axios from 'axios';
import React, { memo, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { API } from '../../../Api/Api';
import Modal from '../../../Utils/Modal';
import UserToInvite from './UserToInvite';
import { showToast } from '../../../Utils/showToast';
import Loader from '../../../Utils/Loader';
import Cookies from 'js-cookie';

const InviteUsersModal = memo(({ community, onClose }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loadingUsers, setLoadingUsers] = useState(true);
    const userId = Cookies.get('userID');
    // Fetch users on mount
    useEffect(() => {
        const getAllUsers = async () => {
            setLoadingUsers(true);
            try {
                const res = await axios.get(`${API.getUserFriendsInfo}/${userId}`);
                console.log(res.data.friends);
                const usersArray = res.data.friends;
                setUsers(usersArray);
            } catch (error) {
                if (error && error.response && error.response.data && error.response.data.message) { 
                    if (error.response.data.message.length > 50)  { 
                        setError("Network error: ")
                    } else {
                        setError(error.response.data.message);
                        showToast('error', error.response.data.message);
                    }
                }
                else 
                    setError(error.message);
            }finally{ 
                setLoadingUsers(false);
            }
        };
        getAllUsers();
    }, []);

    const [usersRemainData, setUsersRemainData] = useState([]);

    useEffect(() => {
        const getEachUserData = async () => {
            try {
                // Fetch data for all users concurrently
                const userDataPromises = users.map(async (user) => {
                    const response = await axios.get(`${API.getUserById}/${user.friendId}`);
                    return response.data; // Assuming the API returns user data
                });

                // Wait for all promises to resolve
                const userData = await Promise.all(userDataPromises);

                // Update the state with the fetched data
                setUsersRemainData(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
            };

            if (users && users.length > 0) {
                getEachUserData();
        }
    }, [users])

    // Memoize the rendered user list
    const MemoizedUserList = useMemo(() => {
        // Create a Set of community member IDs for quick lookups
        const memberSet = new Set(community?.members.map(member => member._id) || []);
        console.log("users: ", usersRemainData);
        
        return <div className='flex flex-col gap-5 px-1'>
            {usersRemainData
                .filter((user) => user != null && !memberSet.has(user._id)) // Exclude users who are already members
                .map((user) => (
                    <UserToInvite key={user._id} user={user} communityId={community?._id} />
                ))}
        </div>;
    }, [usersRemainData, community]);


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
