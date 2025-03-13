import React, { memo } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { FaBookmark, FaLink, FaRegBookmark } from "react-icons/fa6";
import { IoKeySharp } from "react-icons/io5";
import { copyURL } from "../../../Utils/copyURL";
import Cookies from 'js-cookie';
import sweetalert from "../../../Utils/sweetalert";
import { handleSaveVideo, handleUnsaveVideo } from "../../../Redux/slices/savedVideos";
import { useDispatch } from "react-redux";

const VideoOptions = memo(({video, isSaved, inProfile=false, openVideoEdit, handleDeleteVideo}) => {
    const userId = Cookies.get("userID");
    const handleClickEditBtn = () => {
        const details = {
            _id: video._id,
            title: video.title,
            description: video.description,
            videoURL: video.videoUrl,
            thumbnailURL: video.thumbnailUrl,
            tags: video.tags,
        };
        openVideoEdit(details);
    };

    const dispatch = useDispatch();

    const handleClickDeleteBtn = async () => {
        const res = await sweetalert.deleteOrNot({
            title: `Do you want to delete "${video.title.slice(0, 10)}..." video?`,
            confirmBtn: "Delete",
            cancelBtn: "Cancel",
        });
        if (res.isConfirmed) {
            handleDeleteVideo(video._id);
        }
    };

    const handleCopyVideoURL = () => {
        if (video && video.videoUrl) {
            copyURL(video.videoUrl,"Link copied successfully");
        }
    };

    const handleSaveVideoClicked = () => {
        dispatch(handleSaveVideo(video));
    };

    const handleCopyVideoKey = () => { 
        if (video && video.videoKey) { 
            copyURL(video.videoKey,"Key copied successfully");
        }
    };
    const handleUnSaveVideoClicked = () => { 
        dispatch(handleUnsaveVideo(video));
    }
    
    return (
        <div>
            {(
                <div className="absolute text-black flex flex-col items-start overflow-hidden  -top-20 right-8 z-10 w-44  transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm  ">
                <button
                    onClick={handleCopyVideoURL}
                    className="w-full flex gap-2 items-center text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                >
                    
                    <FaLink className="mt-0.5" />
                    <p className="">Copy Link</p>
                </button>
                <button
                    onClick={handleCopyVideoKey}
                    className="w-full flex gap-2 items-center text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                >
                    
                    <IoKeySharp className="mt-0.5" />
                    <p className="">Copy Key</p>
                </button>
                {!isSaved && (
                    <button
                    onClick={handleSaveVideoClicked}
                    className="w-full flex items-center gap-2 text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                    >
                    <FaBookmark />
                    Save Video
                    </button>
                )}
                {isSaved && (
                    <button
                    onClick={handleUnSaveVideoClicked}
                    className="w-full flex items-center gap-2 text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                    >
                    <FaRegBookmark />
                    Unsave Video
                    </button>
                )}
                {video.userId &&
                    video.userId === userId &&
                    inProfile && (
                    <button
                        onClick={handleClickEditBtn}
                        className="w-full flex items-center gap-2 text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                    >
                        <BiEdit />
                        Edit Video
                    </button>
                    )}
                {video.userId &&
                    video.userId === userId &&
                    inProfile && (
                    <button
                        onClick={handleClickDeleteBtn}
                        className="w-full text-main-color flex items-center gap-2 text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                    >
                        <BiTrash />
                        Delete Video
                    </button>
                    )}
                </div>
            )}
        </div>
    )
})

export default VideoOptions