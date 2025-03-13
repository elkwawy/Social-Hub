import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react"; // استخدام useMemo بدلاً من useCallback
import {
  fetchPostsUser,
  addPost,
  deletePost,
  updatePost,
  likePost,
  dislikePost,
  savePost,
  unsavePost,
  resetPostsState,
} from "../Redux/slices/postsReducer";

export const usePosts = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);

  // استخدام useMemo لتجنب إعادة إنشاء الوظيفة في كل مرة
  const fetchUserPosts = useMemo(
    () => (userId) => {
      return dispatch(fetchPostsUser(userId)).unwrap();
    },
    [dispatch]
  );

  const createPost = useMemo(
    () => (data) => {
      return dispatch(addPost(data)).unwrap();
    },
    [dispatch]
  );

  const removePost = useMemo(
    () => (postId) => {
      return dispatch(deletePost(postId)).unwrap();
    },
    [dispatch]
  );

  const editPost = useMemo(
    () => (postId, data) => {
      return dispatch(updatePost({ idPost: postId, data })).unwrap();
    },
    [dispatch]
  );

  const likeAPost = useMemo(
    () => (postId) => {
      return dispatch(likePost(postId)).unwrap();
    },
    [dispatch]
  );

  const dislikeAPost = useMemo(
    () => (postId) => {
      return dispatch(dislikePost(postId)).unwrap();
    },
    [dispatch]
  );

  const saveAPost = useMemo(
    () => (post) => {
      return dispatch(savePost(post)).unwrap();
    },
    [dispatch]
  );

  const unsaveAPost = useMemo(
    () => (post) => {
      return dispatch(unsavePost(post)).unwrap();
    },
    [dispatch]
  );

  // إعادة تعيين الحالة باستخدام useMemo
  const resetPosts = useMemo(
    () => () => {
      dispatch(resetPostsState());
    },
    [dispatch]
  );

  return {
    posts,
    status,
    error,
    fetchUserPosts,
    createPost,
    removePost,
    editPost,
    likeAPost,
    dislikeAPost,
    saveAPost,
    unsaveAPost,
    resetPosts,
  };
};