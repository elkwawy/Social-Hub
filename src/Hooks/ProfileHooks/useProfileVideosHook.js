import axios from "axios";
import { API } from "../../Api/Api";
import { useState } from "react";
import { showToast } from "../../Utils/showToast";
import Cookies from "js-cookie";

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
    const uploadNewVideo = async (inputs) => {
        const formData = new FormData();

        // Append file if available
        if (inputs.videoFile) {
            formData.append('video', inputs.videoFile); // Key matches backend's `req.file`.
        }
        
        formData.append('userId', Cookies.get("userID"));
        formData.append('title', inputs.title);
        formData.append('thumbnailUrl', inputs.thumbnailURL);
        formData.append('description', inputs.description);
        if (inputs.tags?.length) { 
            formData.append('tags', inputs.tags.join(','));
        }

        try {
            setAddVideoLoading(true);

            // Send the request
            const response = await axios.post(`${API.uploadVideo}`, formData);

            // Handle success response
            if (response.data.success) {
                console.log('Video uploaded successfully:', response.data.video);
                setVideos((prev) => [...prev, response.data.video]); // Add new video to state
                showToast('success', "Video added successfully");
                handleOpenUploadVideoModal(); // Close modal
            } else {
                showToast('success', "Something went wrong with uploading video");
            }
        } catch (error) {
            // Handle errors
            const errorMessage = error.response?.data?.message || "Something went wrong with uploading the video.";
            setError(errorMessage);
            console.error(error);
            showToast('error', errorMessage);
        } finally {
            // Always reset loading state
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
