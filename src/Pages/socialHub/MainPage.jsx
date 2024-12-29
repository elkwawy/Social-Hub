import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import VideoGrid from "../../Components/socialHub/MainPage/VideoGrid";
import { getRandomVideos } from "../../Redux/slices/randomVideos";
import { useLocation } from "react-router-dom";

const MainPage = () => {
  const dispatch = useDispatch();
  const { videos, status, error } = useSelector((state) => state.randomVideos);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    // Fetch initial videos on mount
    if (status === 'idle') {
      dispatch(getRandomVideos());
    }
  }, [dispatch, status]);

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo(0, 0);
  }, [useLocation().pathname]);

  useEffect(() => {
    // Infinite scroll handler
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        status === 'succeeded' &&
        !isFetchingMore
      ) {
        setIsFetchingMore(true);
        dispatch(getRandomVideos()).finally(() => setIsFetchingMore(false));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, status, isFetchingMore]);

  if (status === "loading" && videos.length === 0)
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 xl:gap-5">
        {Array.from({ length: 9 }).map((_, index) => (
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
    );

  if (status === "failed")
    return (
      <div className="col-span-full text-center bg-gray-200 text-red-500">
        <p>{error || "Failed to load videos"}</p>
      </div>
    );

  return (
    <div className="min-h-screen">
      <VideoGrid initVideos={videos} />
      {isFetchingMore && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 xl:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
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
      )}
    </div>
  );
};

export default MainPage;
