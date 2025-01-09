import { memo, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useOutletContext, useParams } from "react-router-dom";
import useProfileVideosHook from "../../../../Hooks/ProfileHooks/useProfileVideosHook";
import Modal from "../../../../Utils/Modal";
import VideoGrid from "../../MainPage/VideoGrid";
import AddNewVideoModal from "./AddNewVideoModal";
import UploadVideoModal from "./UploadVideoModal";

const ProfileVideos = memo(() => {
    // const {user, status, error:userError} = useSelector((state) => state.user);
    const {user} = useOutletContext();
    const {videos, getUserVideos, 
        loading:loadingVideos, addVideoLoading,  error, 
        addNewVideo,uploadNewVideo,handleAddNewVideoModal, 
        isAddNewVideoModalOpen, deleteVideo,
        handleOpenUploadVideoModal,
        isUploadVideoModal
    } = useProfileVideosHook();
    const {id} = useParams();
    useEffect(() => { 
        if (user && id) { 
            getUserVideos(id);
        }
    }, [user]);

    const {edit} = useOutletContext();
    
    const handleAddNewVideo = (inputs) => { 
        if (user && user._id)
            addNewVideo(user._id, inputs);
    }
    const handleUploadVideo = (inputs) => { 
        console.log("inputs : ", inputs);
        
        if (user && user._id)
            uploadNewVideo(inputs);
    }
    
    if (loadingVideos)  
        return (
            <div className="w-full flex flex-col gap-5 ">
                <div className="w-full  flex items-center justify-between">
                    <Skeleton width={100} height={32} />
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 xl:gap-5">
                    {Array.from({ length: videos?.length || 6 }).map((_, index) => (
                    <div key={index} className="w-full mx-auto">
                        <div className="w-full h-48 min-[450px]:h-64 min-[550px]:h-80 sm:h-40 xl:h-40 ">
                            <Skeleton height="100%" width="100%" />
                        </div>
                        <div className="w-full h-10 mt-3">
                            <Skeleton height="100%" width="100%" />
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        )
    return (
        <div className="w-full flex flex-col gap-6 ">
            <div className="w-full flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 ">{edit ? "My videos" : "Videos"}</h2>
                <div className="flex items-center gap-3">
                    {edit && videos && videos.length > 0 && <button onClick={handleOpenUploadVideoModal} className="ml-auto text-xs border border-main-color px-3 py-2 text-main-color trans hover:bg-gray-100 rounded-md ">
                        Upload from Device
                    </button>}
                    {edit && videos && videos.length > 0 && <button onClick={handleAddNewVideoModal} className="ml-auto text-xs bg-main-color px-3 py-2 text-white trans hover:bg-sec-color rounded-md ">
                        Add New Video
                    </button>}
                </div>
            </div>

            {videos && videos.length > 0 && <div className="mb-10">
                <VideoGrid initVideos={videos} handleDeleteVideo={deleteVideo} inProfile={true} />
            </div>}

            {
                videos.length ==0 && (edit ?  (<div className="w-full mt-16 text-center flex items-center flex-col gap-3">
                    <h1 className="  text-gray-500 text-2xl font-semibold">You don't have any videos</h1>
                    <button onClick={handleAddNewVideoModal} className="text-xs bg-main-color px-3 py-2 text-white trans hover:bg-sec-color rounded-md ">
                        Add New Video
                    </button>
                </div>)
                : (<div className="w-full mt-16 text-center flex items-center flex-col gap-3">
                    <h1 className="  text-gray-500 text-2xl font-semibold">No videos to show</h1>
                </div>))
            }
            
            {
                isAddNewVideoModalOpen && 
                <Modal title={'Add new video'} onClose={handleAddNewVideoModal} >
                    <AddNewVideoModal addVideo={handleAddNewVideo} addVideoLoading={addVideoLoading}  />
                </Modal>
            }
            {
                isUploadVideoModal && 
                <Modal title={'Upload video from device'} onClose={handleOpenUploadVideoModal} >
                    <UploadVideoModal uploadVideo={handleUploadVideo} addVideoLoading={addVideoLoading}  />
                </Modal>
            }
        </div>
    )
})

export default ProfileVideos;