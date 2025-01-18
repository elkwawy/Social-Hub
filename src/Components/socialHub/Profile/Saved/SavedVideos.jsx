import { useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useSavedItems from "../../../../Hooks/ProfileHooks/useSavedItemsHook";
import Loader from "../../../../Utils/Loader";
import VideoCard from "../../MainPage/VideoCard";

const SavedVideos = () => {
    
    const {videos,videosLoading:loading, getSavedVideos} = useSavedItems();

    useEffect(() => {
        getSavedVideos();
    }, []);
    
    return ( loading ? 
        <div className="w-full h-[250px] flex items-center justify-center">
            <Loader />
        </div>
        : (
            (videos && videos.length > 0) ? 
            <Swiper className="w-full pb-8 select-none"
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24} 
                slidesPerView={1} 
                breakpoints={{
                    640: { slidesPerView: 2 }, 
                    1024: { slidesPerView: 3 }, 
                    1280: { slidesPerView: 4 }, 
                }}
                >
                {videos && videos.map((video) => { 
                    const vid  = {...video,userId:video.ownerId}
                    return (<SwiperSlide key={video._id} >
                        <div>
                            <VideoCard video={vid} isSaved={true} />
                        </div>
                    </SwiperSlide>)
                }
                )}
            </Swiper>
            :
            <div className="text-center text-gray-500 ">No saved videos.</div>
        )
    )
}

export default SavedVideos