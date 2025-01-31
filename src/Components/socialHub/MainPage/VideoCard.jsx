import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BiPlay } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { Img } from "react-image";
import { useInView } from "react-intersection-observer";
import Skeleton from "react-loading-skeleton";
import { API } from "../../../Api/Api";
import { getDateFormatted } from "../../../Utils/getDateFormatted";
import useNavigateTo from "../../../Utils/navigateTo";
import splitTextByLength from "../../../Utils/splitTextByLength";
import VideoOptions from "./VideoOptions";
import checkImg from "../../../Utils/checkImg";

const VideoCard = React.memo(
  ({
    video,
    handleOpenVideoEdit,
    handleDeleteVideo,
    inProfile,
    isSaved = false,
  }) => {
    const navigateTo = useNavigateTo();
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const { ref, inView } = useInView({ triggerOnce: true }); 
  
    const isValidUrl = useCallback(
      (url) => {
        try {
          new URL(url);
          return true;
        } catch (error) {
          return false;
        }
      },
      [video]
    );

    

    useEffect(() => {
      if (inView) {
        // Fetch user data only when in view
        const getUser = async () => {
          try {
            const res = await axios.get(`${API.getUserById}/${video.userId}`);
            if (res.data) { 
              setUser(res.data);
            }
          } catch (error) {
            setUser(null);
          } finally { 
            setIsLoaded(true);
          }
        };
        if (video && video.userId) getUser();
      }
    }, [inView, video.userId]);

    const validUrl = isValidUrl(video.thumbnailUrl) && checkImg(video.thumbnailUrl)
      ? video.thumbnailUrl
      : "/src/assets/noImage.jpg";

    const handleNavToVideoPlayer = () => {
      if (video && video.videoUrl) {
        navigateTo({
          dest: `/socialHub/video/${video._id}`,
          state: { video: video, user },
        });
      }
    };

    const handleNavToUser = () => {
      if (user) {
        navigateTo({
          dest: `/socialHub/profile/${video.userId}`,
          state: { user: user },
        });
      }
    };

    const handleOpenOptions = () => {
      setIsOptionsOpen((prev) => !prev);
    };
    const optionsRef = useRef(null);


    // Close the popover if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
          setIsOptionsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    
    return (
      <div
        ref={ref}
        className="relative max-w-full flex flex-col items-center cursor-pointer trans "
      >
        {inView ? (
          <div
            role="button"
            onClick={handleNavToVideoPlayer}
            className="w-full relative rounded-md group overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            <Img
              src={validUrl}
              className="w-full h-full object-cover rounded-md" // Ensure the image covers the container
              loader={
                <div
                  className="w-full h-full animate-pulse"
                  style={{ aspectRatio: "16/9" }} // Match the aspect ratio
                >
                  <Skeleton height="100%" width="100%" borderRadius={"4px"} />
                </div>
              }
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <BiPlay className="text-white text-6xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ) : (
          
          <div className="w-full h-48 min-[450px]:h-64 min-[550px]:h-80 sm:h-40 xl:h-44 min-[1290px]:h-52 animate-pulse">
            <Skeleton height="100%" width="100%" borderRadius={"4px"} />
          </div>
        )}
        {inView &&
          (isLoaded ? (
            <div className="flex gap-2 mt-3 w-full items-center">
              
              <div className="w-full flex flex-col gap-2  ">
                <button
                  title={splitTextByLength(video.title, 50)}
                  onClick={handleNavToVideoPlayer}
                  className="text-sm text-start flex-wrap break-words text-wrap lg:text-xs xl:text-sm font-semibold break-all whitespace-normal overflow-hidden"
                >
                  {video.title.length > 105
                    ? video.title.slice(0, 105) + " ..."
                    : video.title}
                </button>
                <div className="flex gap-1">
                    <div
                    role="button"
                    className="cursor-pointer float-start"
                    onClick={handleNavToUser}
                  >
                    {user && user.profilePicture ? (
                      isValidUrl(user.profilePicture) &&
                      checkImg(user.profilePicture) ? (
                        <Img
                          className="min-w-9 max-w-9 h-9 rounded-full"
                          src={user.profilePicture}
                          loader={
                            <div className="w-9 h-9 rounded-full">
                              <Skeleton
                                height="100%"
                                width="100%"
                                borderRadius={"100%"}
                              />
                            </div>
                          }
                        />
                      ) : (
                        <FaUserCircle className="text-gray-300 w-9 h-9" />
                      )
                    ) : (
                      <FaUserCircle className="text-gray-300 w-9 h-9" />
                    )}
                  </div>
                  <div className="w-full flex flex-col text-gray-600">
                    <div className="w-full flex justify-between items-center">
                      <button
                        onClick={handleNavToUser}
                        className="w-fit text-xs trans hover:text-black"
                      >

                        { isLoaded ? (user ? user.name : "Deleted User")  : <Skeleton width={15} height={5} />}
                      </button>
                      <div
                        ref={optionsRef}
                        onClick={handleOpenOptions}
                        className={`relative w-6 h-6 group rounded-full flex items-center justify-center trans ${isOptionsOpen ? "bg-gray-200" : ""} hover:bg-gray-200 -mr-1`}
                        >
                        <SlOptionsVertical className="text-sm" />
                        {isOptionsOpen && <VideoOptions video={video} isSaved={isSaved} inProfile={inProfile} openVideoEdit={handleOpenVideoEdit} handleDeleteVideo={handleDeleteVideo}  />}
                      </div>
                    </div>

                    <div
                      role="button"
                      onClick={handleNavToVideoPlayer}
                      className="w-full  font-normal items-center flex gap-1 text-xs"
                    >
                      <p className=" trans ">{video.views} views</p>
                      <span className="w-1 h-1 rounded-full bg-gray-600 mt-0.5" />
                      <p className="text-xs ">
                        {getDateFormatted(video.createdAt)}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[50px] rounded-md flex gap-2 mt-3  items-center">
              <div className="min-w-9 h-9 rounded-full">
                <Skeleton height="100%" width="100%" borderRadius={"100%"} />
              </div>
              <div className="w-full h-full">
                <Skeleton width={"100%"} height={"100%"} />
              </div>
            </div>
          ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.video._id === nextProps.video._id &&
      JSON.stringify(prevProps.video) === JSON.stringify(nextProps.video)
    );
  }
);

export default VideoCard;