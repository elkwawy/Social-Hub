import { API } from "../Api/Api";
import axios from "axios";
import { showToast } from "../Utils/showToast";

const MarketActionsHook = () => {
  const handleError = (error) => {
    showToast(error.response?.data?.message || "An unexpected error occurred");
    console.error(error);
  };

  const incrementLikes = async (postKey, amount) => {
    try {
      await axios.put(API.icrementLikes, {
        objectKey: postKey,
        amount: amount,
      });
      showToast("success", "Likes successfully incremented");
    } catch (error) {
      handleError(error);
    }
  };

  const incrementViews = async (videoKey, amount) => {
    try {
      await axios.put(API.icrementViews, {
        videoKey: videoKey,
        amount: amount,
      });
      showToast("success", "Views successfully incremented");
    } catch (error) {
      handleError(error);
    }
  };

  const incrementComments = async (objectKey, amount) => {
    try {
      await axios.put(API.icrementcomments, {
        objectKey: objectKey,
        amount: amount,
      });
      showToast("success", "Comments successfully incremented");
    } catch (error) {
      handleError(error);
    }
  };

  return {
    incrementLikes,
    incrementViews,
    incrementComments,
  };
};

export default MarketActionsHook;
