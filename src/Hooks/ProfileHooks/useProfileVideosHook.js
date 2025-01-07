import axios from "axios";
import { API } from "../../Api/Api";
import { useState } from "react";
import { showToast } from "../../Utils/showToast";

const useProfileVideosHook = () => {
    const [videos, setVideos] = useState([]);
    const [isAddNewVideoModalOpen, setIsAddNewVideoModalOpen] = useState(false);
    const [isUploadVideoModal, setIsUploadVideoModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addVideoLoading, setAddVideoLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddNewVideoModal = () => { 
        setIsAddNewVideoModalOpen(prev => !prev);
    }
    const handleOpenUploadVideoModal = () => { 
        setIsUploadVideoModal(prev => !prev);
    }

    const getUserVideos = async (uId ) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API.getVideosForSpecificUser}/${uId}`);
            setVideos(response.data.videos);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong with fetching videos.");
        } finally {
            setLoading(false);
        }
    };

    const addNewVideo = async (uId, videoDetails) => {
        // Create a temporary ID for the new video
        const tempId = `temp-${Date.now()}`;
        const tempVideo = { ...videoDetails,userId:uId ,_id: tempId, createdAt : Date.now(), views: 0, likes: [],dislikes: [], };

        // Optimistically update the state
        const prevVideos = [...videos];
        
        try {
            setAddVideoLoading(true);
            setVideos((prevVideos) => [tempVideo, ...prevVideos]);
            const response = await axios.post(`${API.addVideo}`, videoDetails);
            console.log(response.data);
            
            // Replace the temporary video with the response data
            setVideos((prevVideos) =>
                prevVideos.map((video) => (video._id === tempId ? response.data : video))
            );
            showToast('success', "Video added successfully");
            handleAddNewVideoModal();
        } catch (error) {
            setVideos(prevVideos);
            setError(error.response?.data?.message || "Something went wrong with adding the video.");
            showToast('error', error.response?.data?.message || "Something went wrong with adding the video.");
        } finally {
            setAddVideoLoading(false);
        }
    };
    const uploadNewVideo = async (videoDetails) => {
        console.log(videoDetails);
        
        try {
            setAddVideoLoading(true);
            // setVideos((prevVideos) => [tempVideo, ...prevVideos]);
            const response = await axios.post(`${API.uploadVideo}`, videoDetails);
            console.log(response.data);
            
            // Replace the temporary video with the response data
            setVideos(prev => [...prev, ...response.data]);
            showToast('success', "Video added successfully");
            handleAddNewVideoModal();
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong with uploading the video.");
            console.log(error.response?.data?.message);
            showToast('error', error.response?.data?.message || "Something went wrong with uploading the video.");
        } finally {
            setAddVideoLoading(false);
        }
    };

    const deleteVideo =  (videoId) => { 
        setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId))
    }

    return { 
        videos, loading, addVideoLoading, 
        error, getUserVideos, addNewVideo,uploadNewVideo, deleteVideo, 
        handleAddNewVideoModal, isAddNewVideoModalOpen, 
        handleOpenUploadVideoModal, isUploadVideoModal 
    };
};

export default useProfileVideosHook;
