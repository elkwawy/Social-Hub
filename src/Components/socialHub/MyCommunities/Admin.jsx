import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { API } from '../../../Api/Api';
import LazyImage from '../../../Utils/LazyImage';
import checkImageUrl from '../../../Utils/checkImageUrl';
import { Img } from 'react-image';

const Admin = memo(({admin}) => {
    // Get admin's pic  

    const [adminData, setadminData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        const getadminDetails = async () => { 
            try {
                setLoading(true);
                const response = await axios.get(`${API.getUserById}/${admin._id}`);
                setadminData(response.data);
            } catch (error) {
                setError(error)
            } finally{ 
                setLoading(false);
            }
        }
        getadminDetails();
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
                    <div className="w-6 h-6 rounded-full">
                        <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                    </div>
                    <div className='w-20 h-3 rounded-sm'>
                        <Skeleton height="100%" width="100%" borderRadius={"3px"} />
                    </div>
                </div>
            }
            {!loading && adminData && !error && <Link to={`/socialHub/profile/${admin._id}`} className="flex gap-1 items-center">
                
                { adminData && checkImg(adminData.profilePicture) ? (
                <LazyImage
                    className="min-w-6 max-w-6 h-6 rounded-full"
                    src={adminData.profilePicture}
                    loader={
                        <div className="w-6 h-6 rounded-full">
                        <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                        </div>
                    }
                    />
                ) : (
                    <Img
                            className="w-6 h-6 rounded-full bg-white"
                            src={`/src/assets/user.svg`}
                            loader={
                                <div className="w-6 h-6 rounded-full">
                                    <Skeleton height="100%" width="100%" borderRadius={"100%"} />
                                </div>
                            }
                            />
                )}
                <button title={admin.name} className="text-xs text-gray-600">{admin.name.length > 10 ? admin.name.slice(0, 7) + "..."  : admin.name}</button>
            </Link>}
            {
                error &&
                <div className="text-xs text-red-500">{error.message}</div>
            }
        </>
    )
})

export default Admin