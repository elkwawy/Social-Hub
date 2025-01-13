import axios from "axios";
import { API } from "../Api/Api";
import { showToast } from "../Utils/showToast";

const CommentsActionsHook = () => {
  const getComments = async (postId, setComments, setLoading) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API.getComments}/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRepliesOnComment = async (idComment, setReplies, setLoading) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API.RepliesOnComment}/${idComment}`);
      setReplies(response.data.replies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (data, setComments) => {
    try {
      setComments((prevComments) => [...prevComments, data]);

      const { userId, ...cleanedData } = data;

      const response = await axios.post(API.addComment, cleanedData);

      setComments((prevComments) => {
        const filteredComments = prevComments.filter(
          (comment) => comment !== data
        );
        return [...filteredComments, response.data.comment];
      });

      showToast("success", "Comment added successfully");
    } catch (error) {
      setComments((prevComments) => {
        const updatedComments = [...prevComments];
        updatedComments.pop();
        return updatedComments;
      });

      // console.error(error);
      showToast("error", "Failed to add comment");
    }
  };

  const replyComment = async (data, setReplies) => {
    setReplies((prevReplies) => [...prevReplies, data]);
    const { user, ...cleanedData } = data;

    // console.log("data = ", data);

    try {
      const response = await axios.post(API.replyComment, cleanedData); // إرسال الطلب
      // console.log("response.data = ", response.data);

      // Replies تحويل البيانات المرجعة إلى نفس شكل
      const newReply = {
        category: response.data.reply.category,
        desc: response.data.reply.desc,
        objectId: response.data.reply._id,
        replies: response.data.reply.replies || [],
        replyTo: response.data.replyTo,
        user: response.data.user,
      };

      // console.log("newReply = ", newReply);

      setReplies((prevReplies) => {
        const filteredReplies = prevReplies.filter(
          (comment) => comment !== data
        );
        return [...filteredReplies, newReply];
      });

      showToast("success", "Reply added successfully");
    } catch (error) {
      setReplies((prevReplies) => {
        const updatedReplies = [...prevReplies];
        updatedReplies.pop();
        return updatedReplies;
      });
      showToast("error", "Failed to add reply");
    }
  };


  const replyToReply = async (data, setReplies) => {
    setReplies((prevReplies) => [...prevReplies, data]);
    const { user, ...cleanedData } = data;
  
    try {
      const response = await axios.post(API.replyComment, cleanedData);
      const newReply = {
        category: response.data.reply.category,
        desc: response.data.reply.desc,
        objectId: response.data.reply._id,
        replies: response.data.reply.replies || [],
        replyTo: response.data.reply.replyTo,
        user: response.data.user,
      };
  
      setReplies((prevReplies) => {
        const filteredReplies = prevReplies.filter(
          (comment) => comment !== data
        );
        return [...filteredReplies, newReply];
      });
  
      showToast("success", "Reply to reply added successfully");
    } catch (error) {
      setReplies((prevReplies) => {
        const updatedReplies = [...prevReplies];
        updatedReplies.pop();
        return updatedReplies;
      });
      showToast("error", "Failed to add reply to reply");
    }
  };

  const deleteComment = async (
    idComment,
    setComments,
    setCommentsCount,
    // setReplies
  ) => {
    let previousComments = [];
    // let previousReplies = [];

    try {
      
      setComments((prevComments) => {
        previousComments = [...prevComments];
        return prevComments.filter((comment) => comment._id !== idComment); // إزالة التعليق
      });

      // setReplies((prevReplies) => {
      //   previousReplies = [...prevReplies];
      //   return prevReplies.filter((reply) => reply.objectId !== idComment); // reply إزالة ال
      // });

      await axios.delete(`${API.deleteComment}/${idComment}`);
      setCommentsCount((prev) => prev - 1);
      showToast("success", "Comment deleted successfully");
    } catch (error) {
      setComments(previousComments);
      // setReplies(previousReplies);
      showToast("error", "Failed to delete comment");
    }
  };

  return {
    getComments,
    getRepliesOnComment,
    addComment,
    replyComment,
    deleteComment,
  };
};

export default CommentsActionsHook;
