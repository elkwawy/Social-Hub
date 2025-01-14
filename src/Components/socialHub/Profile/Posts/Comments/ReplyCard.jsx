import { AiOutlineDelete, AiOutlineSend } from "react-icons/ai";
import { useState, useEffect } from "react";
import profile from "../../../../../assets/profile.jpg";
import CommentsActionsHook from "../../../../../Hooks/CommentsHook";
import Cookie from "js-cookie";
const ReplyCard = ({ reply, setReplies, borderB, user, edit }) => {
  const { deleteReply, getRepliesOnReply, replyToReply } =
    CommentsActionsHook();

  const [nestedReplies, setNestedReplies] = useState([]);
  const [loadingNestedReplies, setLoadingNestedReplies] = useState(false);
  const [nestedRepliesCount, setNestedRepliesCount] = useState(
    reply?.nestedReplies?.length || 0
  );
  const [nestedReplyText, setNestedReplyText] = useState("");
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const [replyToNestedReply, setReplyToNestedReply] = useState(false);

  useEffect(() => {
    if (nestedRepliesCount > 0) {
      getRepliesOnReply(reply._id, setNestedReplies, setLoadingNestedReplies);
    }
  }, [nestedRepliesCount]);

  const handleReplyToNestedReply = async (replyID) => {
    if (nestedReplyText.trim()) {
      let savedReplyText = nestedReplyText;
      try {
        setNestedReplyText("");
        setReplyToNestedReply(false);
        await replyToReply(
          {
            desc: nestedReplyText,
            replyId: replyID,
            user: {
              name: user?.name,
              profilePicture: user?.profilePicture,
            },
          },
          setNestedReplies
        );
      } catch (error) {
        setNestedReplyText(savedReplyText);
        setReplyToNestedReply(true);
      }
    }
  };

  const handleDeleteNestedReply = async (nestedReplyID) => {
    await deleteReply(nestedReplyID, setReplies);
  };

  console.log(reply);

  return (
    <div className="flex items-start  gap-3">
      <img
        src={reply.user.profilePicture || profile}
        alt="User Avatar"
        className="w-8 h-8 rounded-full"
      />
      <div
        className={`flex justify-between flex-col flex-1 ${borderB && "border-b"} border-gray-200 pb-2`}
      >
        <div key={reply._id} className="flex items-start gap-3 ">
          <div className="flex-1">
            <div className="space-y-1">
              <p className="text-sm font-medium">{reply.user.name}</p>
              <p className="text-sm text-gray-600">{reply.desc}</p>
            </div>

            {/* Show Nested Replies */}
            {reply?.replies?.length > 0 && (
              <button
                className="text-sm text-sec-color mt-2"
                onClick={() => setShowNestedReplies(!showNestedReplies)}
              >
                {showNestedReplies
                  ? "Hide Replies"
                  : `${reply.replies.length} Replies`}
              </button>
            )}
            {showNestedReplies && (
              <div className="mt-4 space-y-5">
                {nestedReplies.map((nestedReply, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      index !== nestedReplies.length - 1 ? "border-b" : ""
                    } border-gray-200`}
                  >
                    <img
                      src={nestedReply.user.profilePicture || profile}
                      alt="User Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {nestedReply.user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {nestedReply.desc}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-gray-500 hover:text-red-600"
                      title="Delete"
                      onClick={() =>
                        handleDeleteNestedReply(nestedReply.objectId)
                      }
                    >
                      <AiOutlineDelete size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/*            
            <button
              className="text-gray-500 hover:text-gray-700"
              title="Reply"
              onClick={() => setReplyToNestedReply(!replyToNestedReply)}
            >
              <MdOutlineReply size={16} />
            </button>
            */}

            {edit ? (
              <button
                className="text-gray-500 hover:text-red-600"
                title="Delete"
                onClick={() => handleDeleteNestedReply(reply.objectId)}
              >
                <AiOutlineDelete size={16} />
              </button>
            ) : (
              Cookie.get("userID") === reply?.user?._id && (
                <button
                  className="text-gray-500 hover:text-red-600"
                  title="Delete"
                  onClick={() => handleDeleteNestedReply(reply.objectId)}
                >
                  <AiOutlineDelete size={16} />
                </button>
              )
            )}
          </div>
        </div>
        {replyToNestedReply && (
          <div className="flex items-center mt-2 gap-2">
            <img
              src={reply.user.profilePicture || profile}
              alt="User Avatar"
              className="w-9 h-9 rounded-full"
            />
            <input
              type="text"
              value={nestedReplyText}
              onChange={(e) => setNestedReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-4 py-[7px] border rounded-lg focus:outline-none focus:ring-1 ring-gray-400"
            />
            <button
              onClick={() => handleReplyToNestedReply(reply.objectId)}
              className="p-2 bg-sec-color text-white rounded-lg hover:bg-main-color focus:outline-none"
            >
              <AiOutlineSend size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyCard;
