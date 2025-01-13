import React, { useEffect, useState } from 'react'
import EditVideoModal from './EditVideo';
import Modal from '../../../Utils/Modal';
import axios from 'axios';
import { API } from '../../../Api/Api';
import { showToast } from '../../../Utils/showToast';
const VideoCard = React.lazy(() => import('../MainPage/VideoCard'));
const MemoizedVideoCard = React.memo(VideoCard);
const VideoGrid = React.memo(({ initVideos:initialVideos, style, handleDeleteVideo, inProfile=false }) => { 
    const [videos, setVideos] = useState(initialVideos);
    const [isVideoEditOpen, setIsVideoEditOpen] = useState(false);
    const [editedVideoDetails, setEditedVideoDetails] = useState(null);
    const [editedVideoId, setEditedVideoId] = useState(null);
    const [editVideoLoading, setEditVideoLoading] = useState(false)
    useEffect(() => { 
        setVideos(initialVideos);
    }, [initialVideos]);
    const handleOpenEditVdieo = (details) => { 
        const {_id, ...resetDetails} = details ; // Destructure _id and keep the rest
        setEditedVideoDetails(resetDetails);
        setEditedVideoId(_id);
        setIsVideoEditOpen(true);
    }
    const handleCloseEditVdieo = () => { 
        setIsVideoEditOpen(false);
    }
    const handleUpdateVideo = async (newUpdates) => { 
        const originalVideos = [...videos]; 
        try {
            setEditVideoLoading(true)
            const updatedVideos = videos.map((video) => 
                video._id === editedVideoId ? { ...video, ...newUpdates } : video
            );
            setVideos(updatedVideos);

            // Send API request
            const res = await axios.put(`${API.updateVideo}/${editedVideoId}`, newUpdates);
            showToast("success", "Video updated successfully");
            handleCloseEditVdieo();
        } catch (error) {
            console.error("Failed to update video:", error);
            showToast("error", error?.response?.data?.message || "Can't update video")
            // Revert to the original state
            setVideos(originalVideos);
            setEditVideoLoading(true)
        } finally {             
            setEditVideoLoading(false)
        }
    };
    const deleteVideo = async (videoId) => { 
        const originalVideos = [...videos]; // Clone the original videos state
        try {
            // Perform optimistic delete
            const updatedVideos = videos.filter((video) => video._id!== videoId);
            setVideos(updatedVideos);
            const response = await axios.delete(`${API.deleteVideo}/${videoId}`);
            showToast("success", "Video deleted successfully")
            handleDeleteVideo(videoId)
        }catch(error){
            showToast("error", error?.response?.data?.message || "Video wasn't deleted");
            setVideos(originalVideos);
        }
    }
    
    return (
        <div className={style ? style : `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5`}>
            {videos && videos.length > 0 && videos.map((vid) => (
            <div key={vid._id} className="mx-auto w-full">
                <MemoizedVideoCard
                    video={vid}
                    handleOpenVideoEdit={handleOpenEditVdieo}
                    handleDeleteVideo={deleteVideo}
                    inProfile={inProfile}  // Passing inProfile prop to VideoCard for different behavior in profile and main page. In profile, it shows edit and delete buttons. In main page, it only shows delete button.
                />
            </div>
            ))}
            {/* {
                videos && videos.length == 0 && 
                <p className='text-3xl text-gray-600 w-full text-center col-span-full font-semibold'>Something went wrong</p>
            } */}
            {isVideoEditOpen && 
                <Modal title={'Edit Video'} onClose={handleCloseEditVdieo} >
                    <EditVideoModal videoDetails={editedVideoDetails} updateVideo={handleUpdateVideo} loading={editVideoLoading}   />
                </Modal>}
        </div>
    )
});

export default VideoGrid
