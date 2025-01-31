import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getSavedVideos } from "../../../../Redux/slices/savedVideos";
import Loader from "../../../../Utils/Loader";
import VideoCard from "../../MainPage/VideoCard";

const SavedVideos = () => {
    const {savedVideos,loading} = useSelector(state => state.savedVideos);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getSavedVideos());
    }, []);

    useEffect(() => {
    }, [savedVideos]);
    
    return ( loading ? 
        <div className="w-full h-[250px] flex items-center justify-center">
            <Loader />
        </div>
        : (
            (savedVideos && savedVideos.length > 0) ? 
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
                {savedVideos && savedVideos.map((video) => { 
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