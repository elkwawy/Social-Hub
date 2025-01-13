import { useEffect, useState } from "react";
import { AiOutlineSend, AiOutlineDelete } from "react-icons/ai";
import { MdOutlineReply } from "react-icons/md";
import profile from "../../../../../assets/profile.jpg";
import CommentsActionsHook from "../../../../../Hooks/CommentsHook";
import ReplyCard from "./ReplyCard";
const CommentCard = ({
  comment,
  user,
  edit,
  setComments,
  setCommentsCount,
  borderB,
}) => {
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesCount, setRepliesCount] = useState(
    comment?.replies?.length || 0
  );
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replyToComment, setReplyToComment] = useState(false);
  const [replyToUser, setReplyToUser] = useState("");

  useEffect(() => {
    if (repliesCount > 0) {
      getRepliesOnComment(comment._id, setReplies, setLoadingReplies);
    }
  }, [repliesCount]);

  const { getRepliesOnComment, replyComment, deleteComment } =
    CommentsActionsHook();

  const handleReply = async (commentID) => {
    if (replyText.trim()) {
      let savedReply = replyText;
      try {
        setReplyText("");
        setReplyToComment(false);
        await replyComment(
          {
            desc: replyText,
            commentId: commentID,
            user: {
              name: user?.name,
              profilePicture: user?.profilePicture,
            },
          },
          setReplies
        );
      } catch (error) {
        setReplyText(savedReply);
        setReplyToComment(true);
      }
    }
  };
  const handleDeleteComment = async (commentID) => {
    await deleteComment(commentID, setComments, setCommentsCount);
  };

  const handleKeyDown = (e, commentID) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleReply(commentID);
    }
  };
  console.log(comment);
  

  return (
    <div className="flex items-start gap-3 mb-4">
      <img
        src={comment.userId.profilePicture || profile}
        alt="User Avatar"
        className="w-8 h-8 rounded-full"
      />
      <div className={`flex-1 pb-1 ${borderB && "border-b"} border-gray-200`}>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium">{comment.userId.name}</p>
            <p className="text-sm text-gray-600">{comment.desc}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-gray-500 hover:text-gray-700"
              title="Reply"
              onClick={() => {
                setReplyToComment(!replyToComment);
                setReplyToUser(comment.userId.name);
              }}
            >
              <MdOutlineReply size={16} />
            </button>
            <button
              className="text-gray-500 hover:text-red-600"
              title="Delete"
              onClick={() => handleDeleteComment(comment.objectId)}
            >
              <AiOutlineDelete size={16} />
            </button>
          </div>
        </div>

        {showReplies && (
          <div className="mt-4 space-y-5">
            {replies.map((reply, index) => (
              <ReplyCard
                key={index}
                reply={reply}
                handleDeleteComment={deleteComment}
                borderB={index !== replies.length - 1}
                user={user}
              />
            ))}
          </div>
        )}

        {replyToComment && (
          <div className="flex items-center py-4 gap-3 rounded-b-lg">
            <img
            src={user.profilePicture || profile}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <input
              type="text"
              placeholder={`Replying to ${replyToUser}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => {
                if (replyToUser && !replyText.includes(`@${replyToUser}:`)) {
                  setReplyText(`@${replyToUser}: `);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, comment._id)}
              className="flex-1 px-4 max-md:px-0 max-md:pl-1 py-2 border rounded-lg focus:outline-none focus:ring-1 ring-gray-400"
            />
            <button
              className="p-2 bg-sec-color text-white rounded-lg hover:bg-main-color focus:outline-none"
              onClick={() => handleReply(comment._id)}
            >
              <AiOutlineSend size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
