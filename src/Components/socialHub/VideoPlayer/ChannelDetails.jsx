import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { Img } from 'react-image';
import Skeleton from 'react-loading-skeleton';
import { API } from '../../../Api/Api';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { isValidUrl } from '../../../Utils/validateURLs';
import checkImg from '../../../Utils/checkImg';

const ChannelDetails = memo(({channelId, name, profilePicture}) => {
    const [channel, setChannel] = useState(null);
    const [error, setError] = useState(null);
    const [amISubscriber, setAmISubscriber] = useState(false);
    const [subscribers, setSubscribers] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Fetch channl data 
        const getUser = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API.getUserById}/${channelId}`);
                const answer = res.data.SubscribersOrFollowers.find((followerId) => followerId === currUserId);
                if (answer)
                    setAmISubscriber(answer);
                else if (!answer)
                    setAmISubscriber(answer);
                setChannel(res.data);
                setSubscribers(res.data.SubscribersOrFollowers.length);
                
            } catch (error) {
                if (error?.response?.data?.message)
                    setError(error?.response?.data?.message);
                else 
                setError("There is error with this channel");
                setAmISubscriber(false);
            } finally { 
                setLoading(false);
            }
        };
        getUser();
    }, [channelId]);

    const handleFollowAndUnfollow = async () => { 
        if (channel && currUserId) {
            if (amISubscriber) { 
                // unsbscribe
                setAmISubscriber(false);
                setSubscribers(prev => prev - 1);
                try {
                    const res = await axios.put(`${API.unsubscribe}/${channel._id}`);
                    console.log(res.data);
                } catch (error) {
                    showToast('error', "Something went wrong");
                    setSubscribers(prev => prev + 1);
                    setAmISubscriber(true);
                }
            }
            else { 
                setAmISubscriber(true);
                setSubscribers(prev => prev + 1);
                try {
                    const res = await axios.put(`${API.subscribe}/${channel._id}`);
                    console.log(res.data);
                    
                } catch (error) {
                    showToast('error', "Something went wrong");
                    setAmISubscriber(false);
                    setSubscribers(prev => prev - 1);
                }
            }
        }
    }
    

    const currUserId = Cookies.get("userID");
    const isMyVideo = channelId == currUserId;
    return (
        <div className='flex items-center jusbet gap-3 '>
            {/* channel image */}
            <Link aria-disabled={name ? false : true} to={`/socialHub/profile/${channelId}`} className='min-w-10 max-w-10 h-10 rounded-full '>
                {
                    profilePicture && isValidUrl(profilePicture) && checkImg(profilePicture)
                    ? <Img src={profilePicture} className='w-full h-full rounded-full' loader={<div className='w-10 h-10 rounded-full'><Skeleton width={'100%'} height={'100%'} borderRadius={'100%'} /></div>} />
                    : <FaUserCircle className="text-gray-300 w-9 h-9" />
                }
            </Link>
            <div className='flex flex-col text-sm'>
                <Link to={`/socialHub/profile/${channelId}`} className=''>{name ? name : "Deleted user"}</Link>
                <div className='text-gray-500 flex items-center'>
                    {
                        loading ? <p className='blur-sm'>0 </p> 
                        : subscribers  ? subscribers : 0
                    }
                    {" "}Subscribers
                </div>
            </div>
            {!isMyVideo && name && <button  onClick={handleFollowAndUnfollow} className={` rounded-full ${amISubscriber ? "bg-white text-black hover:bg-gray-100" : "text-white hover:bg-sec-color bg-main-color"}  border shadow-sm py-2 px-4 sm:px-8 text-sm ml-auto sm:ml-2  trans `}>{amISubscriber ? "Unsubscribe" :"Subscribe"}</button>}
        </div>
    )
})

export default ChannelDetails