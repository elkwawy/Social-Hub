import React from 'react'
import { Img } from 'react-image'
import checkImg from '../../../Utils/checkImg'
import Skeleton from 'react-loading-skeleton'
import profile from "../../../assets/profile.jpg";
import { Link } from 'react-router-dom';

const ModalMember = ({member}) => {
    return (
        <Link to={`/socialHub/profile/${member._id}`} className='flex select-none items-center gap-3 hover:bg-gray-100 cursor-pointer trans p-2 rounded-md'>
            { member && (member.profilePicture) && checkImg(member.profilePicture) ? (
                <Img
                    className="w-10 h-10 rounded-full"
                    src={member.profilePicture}
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
                <p>{member.name}</p>
        </Link>
    )
}

export default ModalMember