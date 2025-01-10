import axios from "axios";
import Cookies from "js-cookie";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BiPlay } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { Img } from "react-image";
import { useInView } from "react-intersection-observer";
import Skeleton from "react-loading-skeleton";
import { API } from "../../../Api/Api";
import { getDateFormatted } from "../../../Utils/getDateFormatted";
import LazyImage from "../../../Utils/LazyImage";
import useNavigateTo from "../../../Utils/navigateTo";
import { showToast } from "../../../Utils/showToast";
import sweetalert from "../../../Utils/sweetalert";
import { isVideoURL } from "../../../Utils/validateURLs";
import { copyURL } from "./../../../Utils/copyURL";
import { IoCopy } from "react-icons/io5";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import useSavedItems from "../../../Hooks/ProfileHooks/useSavedItemsHook";
import { BiEdit, BiTrash, BiShare } from "react-icons/bi";
import checkImageUrl from "../../../Utils/checkImageUrl";
import splitTextByLength from "../../../Utils/splitTextByLength";
const VideoCard = React.memo(
  ({
    video,
    handleOpenVideoEdit,
    handleDeleteVideo,
    inProfile,
    isSaved = false,
    unsaveVideo,
  }) => {
    const navigateTo = useNavigateTo();
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const { ref, inView } = useInView({ triggerOnce: true }); // Trigger once when in view
    const userId = Cookies.get("userID");
    const { handleSaveVideo } = useSavedItems();

    const isValidUrl = useCallback(
      (url) => {
        try {
          new URL(url); // Checks if the URL is valid
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
            setUser(res.data);
            setIsLoaded(true); // Mark as loaded
          } catch (error) {
            setUser(null);
          }
        };
        if (video && video.userId) getUser();
        setIsLoaded(true); // Mark as loaded
      }
    }, [inView, video.userId]);

    const validUrl = isValidUrl(video.thumbnailUrl)
      ? video.thumbnailUrl
      : "/src/assets/noImage.jpg";

    const handleNavToVideoPlayer = () => {
      if (user) {
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
    const optionsRef = useRef(null);

    const handleOpenOptions = () => {
      setIsOptionsOpen((prev) => !prev);
    };

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

    const handleClickEditBtn = () => {
      const details = {
        _id: video._id,
        title: video.title,
        description: video.description,
        videoURL: video.videoUrl,
        thumbnailURL: video.thumbnailUrl,
        tags: video.tags,
      };
      handleOpenVideoEdit(details);
    };
    const handleClickDeleteBtn = async () => {
      const res = await sweetalert.deleteOrNot({
        title: `Do you want to delete "${video.title.slice(0, 10)}..." video?`,
        confirmBtn: "Delete",
        cancelBtn: "Cancel",
      });
      if (res.isConfirmed) {
        handleDeleteVideo(video._id);
      }
    };

    const handleCopyVideoURL = () => {
      if (video && video.videoUrl && isVideoURL(video.videoUrl)) {
        copyURL(video.videoUrl);
      } else {
        showToast("error", "Invalid Video URL");
      }
    };

    const handleSaveVideoClicked = () => {
      handleSaveVideo(video);
    };

    const checkImg = async (url) => {
      await checkImageUrl(url).then((isValid) => {
        if (isValid) {
          return true;
        } else {
          return false;
        }
      });
    };

    return (
      <div
        ref={ref}
        className="relative max-w-full flex flex-col items-center cursor-pointer trans "
      >
        {inView ? (
          <div
            role="button"
            onClick={handleNavToVideoPlayer}
            className="min-w-full relative rounded-md group overflow-hidden"
          >
            <Img
              src={validUrl}
              className="min-w-full overflow-hidden group-hover:scale-105 trans border rounded-md"
              loader={
                <div className="w-full h-48 min-[450px]:h-64 min-[550px]:h-80 sm:h-40 xl:h-44 min-[1290px]:h-52 animate-pulse">
                  <Skeleton height="100%" width="100%" borderRadius={"4px"} />
                </div>
              }
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <BiPlay className="text-white text-6xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ) : (
          // Placeholder while out of view
          <div className="w-full h-48 min-[450px]:h-64 min-[550px]:h-80 sm:h-40 xl:h-44 min-[1290px]:h-52 animate-pulse">
            <Skeleton height="100%" width="100%" borderRadius={"4px"} />
          </div>
        )}
        {inView &&
          (isLoaded ? (
            <div className="flex gap-2 mt-3 w-full items-center">
              <div
                role="button"
                className="cursor-pointer float-start"
                onClick={handleNavToUser}
              >
                {user && user.profilePicture ? (
                  isValidUrl(user.profilePicture) &&
                  checkImg(user.profilePicture) ? (
                    <LazyImage
                      className="max-w-9 h-9 rounded-full"
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
              <div className="w-full flex flex-col gap-0.5  ">
                <div className="relative group inline-block">
                  <button
                    title={splitTextByLength(video.title, 50)}
                    onClick={handleNavToVideoPlayer}
                    className="text-sm flex-wrap break-words text-wrap lg:text-xs xl:text-sm font-semibold break-all whitespace-normal overflow-hidden"
                  >
                    {video.title.length > 105
                      ? video.title.slice(0, 105) + " ..."
                      : video.title}
                  </button>
                </div>
                <div className="w-full flex flex-col text-gray-600">
                  <div className="w-full flex justify-between items-center">
                    <button
                      onClick={handleNavToUser}
                      className="w-fit text-xs trans hover:text-black"
                    >
                      {user ? user.name : "Default User"}
                    </button>
                    <div
                      ref={optionsRef}
                      onClick={handleOpenOptions}
                      className="relative w-6 h-6 group rounded-full flex items-center justify-center trans focus:bg-gray-200 hover:bg-gray-200 -mr-1"
                    >
                      <SlOptionsVertical className="text-sm" />
                      {isOptionsOpen && (
                        <div className="absolute text-black flex flex-col items-start overflow-hidden  -top-14 right-8 z-10 w-44  transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm  ">
                          <button
                            onClick={handleCopyVideoURL}
                            className="w-full flex gap-2 items-center text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                          >
                            <IoCopy />
                            <p className="">Copy Link</p>
                          </button>
                          {!isSaved && (
                            <button
                              onClick={handleSaveVideoClicked}
                              className="w-full flex items-center gap-2 text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                            >
                              <FaBookmark />
                              Save Video
                            </button>
                          )}
                          {isSaved && (
                            <button
                              onClick={() => unsaveVideo(video)}
                              className="w-full flex items-center gap-2 text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                            >
                              <FaRegBookmark />
                              Unsave Video
                            </button>
                          )}
                          {video.userId &&
                            video.userId === userId &&
                            inProfile && (
                              <button
                                onClick={handleClickEditBtn}
                                className="w-full flex items-center gap-2 text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                              >
                                <BiEdit />
                                Edit Video
                              </button>
                            )}
                          {video.userId &&
                            video.userId === userId &&
                            inProfile && (
                              <button
                                onClick={handleClickDeleteBtn}
                                className="w-full text-main-color flex items-center gap-2 text-left px-4 trans hover:bg-gray-200 cursor-pointer py-2"
                              >
                                <BiTrash />
                                Delete Video
                              </button>
                            )}
                        </div>
                      )}
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
