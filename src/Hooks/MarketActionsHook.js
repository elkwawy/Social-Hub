import { API } from "../Api/Api";
import axios from "axios";
import { showToast } from "../Utils/showToast";

const MarketActionsHook = () => {
  const handleError = (error) => {
    showToast(error.response?.data?.message || "An unexpected error occurred");
    console.error(error);
  };

  const incrementLikes = async (objectKey, amount, setLoading) => {
    setLoading(true);
    try {
      await axios.put(API.icrementLikes, {
        postKey: objectKey,
        amount: amount,
      });
      showToast("success", "Likes successfully incremented");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (videoKey, amount, setLoading) => {
    setLoading(true);
    try {
      await axios.put(API.icrementViews, {
        videoKey: videoKey,
        amount: amount,
      });
      showToast("success", "Views successfully incremented");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const incrementComments = async (objectKey, amount, setLoading) => {
    setLoading(true);
    try {
      await axios.put(API.icrementcomments, {
        objectKey: objectKey,
        amount: amount,
      });
      showToast("success", "Comments successfully incremented");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    incrementLikes,
    incrementViews,
    incrementComments,
  };
};

export default MarketActionsHook;
