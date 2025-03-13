import { BiEdit, BiTrash, BiShare } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import { usePosts } from "../../../../Hooks/usePosts";
import { useState } from "react";
import UpdatePostModal from "./UpdatePostModal";
import Modal from "../../../../Utils/Modal";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
function PostActions({ post,saved=false, setShowActions, edit }) {
  const { removePost, saveAPost, unsaveAPost } = usePosts();
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [isUpdatePostModalOpen, setIsUpdatePostModalOpen] = useState(false);

  const [isSaved, setIsSaved] = useState(saved || false);
  const [isProcessingSave, setIsProcessingSave] = useState(false);

  const handleSave = async () => {
    if (isSaved || isProcessingSave) return;

    setIsProcessingSave(true);
    setIsSaved(true);

    try {
      await saveAPost(post);
    } catch (err) {
      setIsSaved(false);
    } finally {
      setIsProcessingSave(false);
    }
  };

  const handleUnsave = async () => {
    if (!isSaved || isProcessingSave) return;

    setIsProcessingSave(true);
    setIsSaved(false);

    try {
      await unsaveAPost(post);
    } catch (err) {
      setIsSaved(true);
    } finally {
      setIsProcessingSave(false);
    }
  };

  const handleEdit = async () => {
    setIsUpdatePostModalOpen(true);
    // setShowActions(false);
  };

  const handleDeletePost = async () => {
    setDeletePostLoading(true);
    await removePost(post._id);
    setDeletePostLoading(false);
    setShowActions(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowActions(false);
  };
  const handleCopyPostKey = () => {
    const textToCopy = post.postKey;
    navigator.clipboard.writeText(textToCopy);
    setShowActions(false);
  };

  return (
    <>
      <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg  w-48 z-10">
        {edit && !saved &&(
          <button
            onClick={handleEdit}
            className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100"
          >
            <BiEdit />
            <span>Edit Post</span>
          </button>
        )}
        {edit && !saved &&(
          <button
            onClick={handleDeletePost}
            disabled={deletePostLoading}
            className={`${deletePostLoading && "cursor-not-allowed"} w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 text-red-500`}
          >
            <BiTrash />
            <span>{deletePostLoading ? "Deleting..." : "Delete Post"}</span>
          </button>
        )}
        <button
          onClick={handleCopyPostKey}
          className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100"
        >
          <IoCopy />
          <span>Copy Key</span>
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={isSaved ? handleUnsave : handleSave}
            disabled={isProcessingSave}
            className={`${isProcessingSave && "cursor-not-allowed"} w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100  
          
          `}
          >
            {isSaved ? <FaRegBookmark size={16} /> : <FaBookmark size={16} />}
            <span>{isSaved ? "Unsave" : "Save"}</span>
          </button>
        </div>
        <button
          onClick={handleShare}
          className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100"
        >
          <BiShare />
          <span>Copy Link</span>
        </button>
      </div>
      {isUpdatePostModalOpen && (
        <Modal
          title={"Update Post"}
          onClose={() => setIsUpdatePostModalOpen(false)}
        >
          <UpdatePostModal
            post={post}
            setCloseModal={setIsUpdatePostModalOpen}
          />
        </Modal>
      )}
    </>
  );
}

export default PostActions;
