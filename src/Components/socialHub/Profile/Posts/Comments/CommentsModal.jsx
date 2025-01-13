import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CommentCard from "./CommentCard";
import profile from "../../../../../assets/profile.jpg";
import CommentsActionsHook from "../../../../../Hooks/CommentsHook";

const CommentsModal = ({ post, user,setModalOpen, setCommentsCount , edit }) => {
  const commentsSectionRef = useRef(null);
  const { getComments, addComment } = CommentsActionsHook();
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  console.log(comments);

  useEffect(() => {
    if (post?._id) {
      setLoadingComments(true);
      getComments(post._id, setComments, setLoadingComments);
    }
  }, [post]);

  const [count, setCount] = useState(0);
  const handleAddComment = async () => {
    setCount(count + 1);
    if (newComment.trim()) {
      const savedComment = newComment;
      setNewComment("");
      try {
        await addComment(
          {
            desc: newComment,
            objectId: post._id,
            userId: {
              // local data
              name: user?.name,
              profilePicture: user?.profilePicture,
              _id: user?._id,
            },
          },
          setComments
        );
        setCommentsCount((prev) => prev + 1);
      } catch (error) {
        console.log("Error handleAddComment");
        setNewComment(savedComment);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddComment();
    }
  };

  useEffect(() => {
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollTop =
        commentsSectionRef.current.scrollHeight;
    }
  }, [count]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="bg-white w-full max-w-2xl rounded shadow-xl max-h-[90%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-2 px-4 border-b">
          <h2 className="text-lg font-semibold">{user && user.name}'s Post</h2>
          <button
            onClick={() => setModalOpen(false)}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        {/* Comments Section */}
        <div className="overflow-y-auto flex-1" ref={commentsSectionRef}>
          <div className="py-2 px-4 space-y-5">
            <h3 className="text-md font-semibold -mt-1 mb-3">Comments</h3>
            {loadingComments ? (
              Array(5)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-2 py-1"
                  >
                    <Skeleton circle={true} height={40} width={40} />
                    <div className="space-y-1 flex-1">
                      <Skeleton height={20} width="30%" />
                      <Skeleton height={15} width="45%" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Skeleton circle={true} height={20} width={20} />{" "}
                      <Skeleton circle={true} height={20} width={20} />{" "}
                    </div>
                  </div>
                ))
            ) : comments.length === 0 ? (
              <div className="w-full flex h-[360px] items-center justify-center">
                <h3 className="text-md font-semibold -mt-1 mb-3">
                  No comments yet
                </h3>
              </div>
            ) : (
              comments.map((comment, index) => (
                <CommentCard
                  key={index}
                  comment={comment}
                  user={user}
                  edit={edit}
                  borderB={index !== comments.length - 1}
                  setComments={setComments}
                  setCommentsCount={setCommentsCount}
                />
              ))
            )}
          </div>
        </div>
        {/* Add Comment Section */}
        <div className="flex items-center py-4 gap-3 rounded-b-lg bg-white border-t px-4">
          <img
            src={user.profilePicture || profile}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 max-md:px-0 max-md:pl-1 py-2 border rounded-lg focus:outline-none focus:ring-1 ring-gray-400"
          />
          <button
            className="p-2 bg-sec-color text-white rounded-lg hover:bg-main-color focus:outline-none"
            onClick={handleAddComment}
          >
            <AiOutlineSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
