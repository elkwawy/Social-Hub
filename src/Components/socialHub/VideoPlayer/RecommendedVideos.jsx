import axios from "axios";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom";
import { API } from "../../../Api/Api";
import VideoGrid from "../MainPage/VideoGrid";
import Loader from "../../../Utils/Loader";

const RecommendedVideos = () => {
  const { id: videoId } = useParams();
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    triggerOnce: true,
  });
  useEffect(() => {
    const getVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API.getRandomVideos}?page=${page}`);
        setVideos((prevVideos) => [...prevVideos, ...res.data.videos]);
        setHasMore(res.data.videos.length > 0);
      } catch (error) {
        setError(error?.response?.data?.message || "Something went wrong with fetching videos");
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      getVideos();
    }
  }, [page, videoId]);

  useEffect(() => { 
    setPage(1);
    setVideos([]);
  }, [videoId])

  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]);

  if (loading && page === 1) 
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 xl:gap-5">
          {Array.from({ length: 12 }).map((_, index) => (
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
    )
  if (error && error!= "No more videos available.") 
    return <div className="w-full flex items-center justify-center text-gray-600 text-center">{error}</div>
  
  return (
    <>
      <div ref={ref}>
        {inView  && videos && videos.length > 0 && <div>
            <VideoGrid initVideos={
                videos.filter((vid) => vid._id != videoId)
              }/>
        </div>}
      </div>
      
      {hasMore && (
        <div ref={ref}>
          {loading && <div className="w-full flex items-center justify-center"><Loader/></div>}
        </div>
      )}
    </>
  )
}

export default RecommendedVideos;