import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { API } from '../../../Api/Api';
import { Img } from 'react-image';
import profile from "../../../assets/profile.jpg";
import checkImg from '../../../Utils/checkImg';

const Member = memo(({member, index}) => {
    // Get member's pic 
    console.log(member);
    const [memberData, setmemberData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        const getmemberDetails = async () => { 
            try {
                setLoading(true);
                const response = await axios.get(`${API.getUserById}/${member._id}`);
                console.log(response);
                
                setmemberData(response.data);
            } catch (error) {
                setError(error)
            } finally{ 
                setLoading(false);
            }
        }
        getmemberDetails();
    }, []);
    
    
    return (
        <>
            {
                loading && 
                <div className='w-fit flex gap-1'>
                    <div className='w-10 h-10 rounded-full'>
                        <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                    </div>
                </div>
            }
            {!loading && !error && <div style={{marginLeft : index > 0 ? "-15px" : "0px"}} className="flex gap-1 items-center">
                
                { memberData && (memberData.profilePicture) && checkImg(memberData.profilePicture) ? (
                <Img
                    className="w-10 h-10 rounded-full"
                    src={memberData.profilePicture}
                    loader={
                        <div className="w-10 h-10 rounded-full">
                            <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                        </div>
                    }
                    />
                ) : (  
                    <Img
                        className="w-10 h-10 rounded-full bg-white"
                        src={profile}
                        loader={
                            <div className="w-10 h-10 rounded-full">
                                <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                            </div>
                        }
                    />
                )}
            </div>}
            {
                error &&
                <p className="text-red-500 text-xs">{error.message}</p>
            }
        </>
    )
})

export default Member