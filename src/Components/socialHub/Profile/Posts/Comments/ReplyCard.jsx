import { AiOutlineDelete, AiOutlineSend } from "react-icons/ai";
import { MdOutlineReply } from "react-icons/md";
import { useState } from "react";
import profile from "../../../../../assets/profile.jpg";

const ReplyCard = ({ reply,  borderB, user }) => {
  // const [replyText, setReplyText] = useState("");
  // const [replyToReply, setReplyToReply] = useState(false);

  // const handleReplyToReply = async (replyID) => {
  //   // Logic to reply to a reply
  //   if (replyText.trim()) {
  //     console.log(`Replying to reply with ID ${replyID}`);
  //     setReplyText("");
  //     setReplyToReply(false);
  //   }
  // };

  return (
    <div className="flex items-center justify-between">
      <div key={reply._id} className="flex items-start gap-3 ml-6">
        <img
          src={reply.user.profilePicture || profile}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="space-y-1">
            <p className="text-sm font-medium">{reply.user.name}</p>
            <p className="text-sm text-gray-600">{reply.desc}</p>
          </div>
          {replyToReply && (
            <div className="flex items-center mt-2 gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ring-gray-400"
              />
              <button
                onClick={() => handleReplyToReply(reply._id)}
                className="p-2 bg-sec-color text-white rounded-lg hover:bg-main-color focus:outline-none"
              >
                <AiOutlineSend size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="text-gray-500 hover:text-gray-700"
          title="Reply"
          onClick={() => setReplyToReply(!replyToReply)}
        >
          <MdOutlineReply size={16} />
        </button>
        <button
          className="text-gray-500 hover:text-red-600"
          title="Delete"
          onClick={() => handleDeleteComment(reply._id)}
        >
          <AiOutlineDelete size={16} />
        </button>
      </div>
    </div>
  );
};

export default ReplyCard;
