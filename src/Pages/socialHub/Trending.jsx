import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import VideoGrid from "../../Components/socialHub/MainPage/VideoGrid";
import { getTrendyVideos } from "../../Redux/slices/trendyVideos";
import { useLocation } from "react-router-dom";
import Loader from "../../Utils/Loader";

const Trending = () => {
  const dispatch = useDispatch();
  const { videos, status, error, currentPage, hasMore } = useSelector((state) => state.trendyVideos);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    // Fetch initial videos
    if (status === "idle") {
      dispatch(getTrendyVideos(currentPage));
    }
  }, [dispatch, status, currentPage]);

  useEffect(() => {
    // Scroll to the top when location changes
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  useEffect(() => {
    // Infinite scroll handler
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        status === "succeeded" &&
        hasMore &&
        !isFetchingMore
      ) {
        setIsFetchingMore(true);
        dispatch(getTrendyVideos(currentPage + 1))
          .finally(() => setIsFetchingMore(false))
          .catch((err) => {
            if (err.response?.data?.message === "No more trending videos available.") {
              // Stop further fetching if no more videos
              dispatch({ type: "trendyVideos/stopFetching" });
            }
          });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, status, hasMore, isFetchingMore, currentPage]);

  // Show skeletons while loading
  if (status === "loading" && videos.length === 0) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 xl:gap-5">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="w-full mx-auto">
            <div className="w-full h-24 lg:h-32 xl:h-56 mb-4">
              <Skeleton height="100%" width="100%" />
            </div>
            <div className="w-full h-5">
              <Skeleton height="100%" width="100%" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error message if loading failed
  if (status === "failed" && error !== "No more trending videos available.") { 
    let err = error ? error : "Failed to load videos";
    return (
      <div className="col-span-full h-[calc(100vh-123px)]  text-center flex items-center justify-center ">
        <Error error={err} fontSize={"text-lg"} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Show video cards when data is successfully loaded */}
      <VideoGrid initVideos={videos} />
      {/* Show loading indicator while fetching more videos */}
      {isFetchingMore && (
        <div className="w-full flex justify-center  my-4">
          <Loader />
        </div>
      )}
      {!hasMore && (
        <div className="text-center mt-8 text-gray-500">
          <p>No more videos available.</p>
        </div>
      )}
    </div>
  );
};

export default Trending;
