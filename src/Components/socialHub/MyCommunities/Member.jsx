import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { API } from '../../../Api/Api';
import { Img } from 'react-image';
import checkImageUrl from '../../../Utils/checkImageUrl';

const Member = memo(({member, index}) => {
    // Get member's pic 
    const [memberData, setmemberData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        const getmemberDetails = async () => { 
            try {
                setLoading(true);
                const response = await axios.get(`${API.getUserById}/${member._id}`);
                setmemberData(response.data);
            } catch (error) {
                setError(error)
            } finally{ 
                setLoading(false);
            }
        }
        getmemberDetails();
    }, []);

    const checkImg = async (url) => {
        await checkImageUrl(url).then((isValid) => {
        if (isValid) {
            return true;
        } else {
            return false;
        }
        });
    };
    
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
                
                { memberData && checkImg(memberData.profilePicture) ? (
                <Img
                    className="w-10 h-10 rounded-full"
                    src={memberData.profilePicture}
                    loader={
                        <div className="w-10 h-10 rounded-full">
                            <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                        </div>
                    }
                    />
                ) : ( !loading && 
                        <Img
                            className="w-10 h-10 rounded-full bg-white"
                            src={`/src/assets/user.svg`}
                            loader={
                                <div className="w-10 h-10 rounded-full">
                                    <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                                </div>
                            }
                            />
                )}
                {/* <p className="text-xs text-gray-600">{member.name}</p> */}
            </div>}
            {
                error &&
                <p className="text-red-500 text-xs">{error.message}</p>
            }
        </>
    )
})

export default Member