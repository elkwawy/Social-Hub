export const BASE_URL = `http://localhost:5173/api`;

export const API = {
  /* ======= Authentication ======= */
  signup: `${BASE_URL}/auth/signup`,
  signin: `${BASE_URL}/auth/signin`,
  sendOtpForResetPassword: `${BASE_URL}/auth/send-password-otp`,
  verifyOtpAndResetPassword: `${BASE_URL}/auth/reset-password-with-otp`,
  /* ======= Posts ======= */
  addPost: `${BASE_URL}/routPost`,
  deletePost: `${BASE_URL}/routPost`, //     /:idPost
  getAllPosts: `${BASE_URL}/routPost/random`, //     /:idUser
  getPostsUser: `${BASE_URL}/routPost/find`, //     /:idUser
  updatePost: `${BASE_URL}/routPost`, //     /:idPost
  likePost: (idPost) => `${BASE_URL}/routPost/${idPost}/like`,
  dislikePost: (idPost) => `${BASE_URL}/routPost/${idPost}/dislike`,
  copyUrlForPost: (idPost) => `${BASE_URL}/routPost/${idPost}/copyUrl`,
  savePost: `${BASE_URL}/routPost/savePost`, //     /:idPost
  unsavePost: `${BASE_URL}/routPost/unsavePost`, //     /:idPost
  getSavedPosts: `${BASE_URL}/routPost/getSavedPosts`, //     /:idPost
  /* ======= Masseges ======= */
  SendMessege: `${BASE_URL}/messages`, // Post
  getUsersInChat: `${BASE_URL}/messages/getUsersWithChatMessages`, // Post
  getMessages: `${BASE_URL}/messages/conversation`, // /:recieverId
  markMessagesAsRead : (msgId) => `${BASE_URL}/messages/${msgId}/mark-as-read`, 
  /* ======= Comments ======= */
  addComment: `${BASE_URL}/comments`,
  replyComment: `${BASE_URL}/comments/addReply`,
  getComments: `${BASE_URL}/comments`, //     /:idPost
  RepliesOnComment: `${BASE_URL}/comments/replies`, //     /:idComment
  deleteComment: `${BASE_URL}/comments`, //     /:idComment
  /* ======= Videos ======= */
  addVideo: `${BASE_URL}/videos`,
  getVideo: `${BASE_URL}/videos/spicificVideo/`, // /:videoId
  searchVideo: `${BASE_URL}/videos/search`, //   params : q
  getTrendVideos: `${BASE_URL}/videos/trend`,
  getRandomVideos: `${BASE_URL}/videos/random`,
  getVideosByTags: `${BASE_URL}/videos/tags`, // params : tags as a string
  getVideosForSpecificUser: `${BASE_URL}/videos/find`, // /:userId
  viewVideo: `${BASE_URL}/videos/viewMoudel`, //   /:videoId
  updateVideo: `${BASE_URL}/videos`, //   /:videoId
  deleteVideo: `${BASE_URL}/videos`, //   /:videoId
  copyUrlForVideo: (idVideo) => `${BASE_URL}/videos/${idVideo}/copyUrl`,
  saveVideo: `${BASE_URL}/videos/save`, //   /:videoId
  unSaveVideo: `${BASE_URL}/videos/unsave`, //   /:videoId
  likeVideo: `${BASE_URL}/users/like`, //   /:videoId
  disLikeVideo: `${BASE_URL}/users/dislike`, //   /:videoId
  getSavedVideos: `${BASE_URL}/videos/getSavedVideos`,  
  uploadVideo : `${BASE_URL}/videos/upload`,
  /* ======= Users ======= */
  getAllUsers: `${BASE_URL}/users/getRandomUsers`,
  searchByName: `${BASE_URL}/users/Search_Users_Name`,
  getUserById: `${BASE_URL}/users/find`, //     /:userID
  getMutualFriends: `${BASE_URL}/users/getMutual`, //     /:FriendID
  getUserFriendsInfo: `${BASE_URL}/users/getUserFriendsInfo/`,
  updateUser: `${BASE_URL}/users`, // :userId

  subscribe: `${BASE_URL}/users/sub`, //   /:userID
  unsubscribe: `${BASE_URL}/users/unsub`, //   /:userID
  addFriend: `${BASE_URL}/users/send-request`, //     /:FriendID

  acceptFriend: `${BASE_URL}/users/accept-request`, //     /:senderId
  rejectFriend: `${BASE_URL}/users/reject-request`, //     /:senderId

  blockUser: `${BASE_URL}/users/block`,
  unBlockUser: `${BASE_URL}/users/unblock`,

  likeVideo: `${BASE_URL}/users/like`, //   /:videoId
  dislikeVideo: `${BASE_URL}/users/dislike`, //   /:videoId
  getSavedItems: `${BASE_URL}/users/saved-items`,
  deleteUser: `${BASE_URL}/users`, //   /:userId
  /* ======= Communities ======= */
  createCommunity: `${BASE_URL}/communities/create`,
  getCommunityById: `${BASE_URL}/communities/community`, // /:idCommunity
  inviteToCommunity: `${BASE_URL}/communities/invite`,
  getCommunityRequests: `${BASE_URL}/communities/getCommunityRequests`,
  acceptInvitation: `${BASE_URL}/communities//accept-invitation`,
  ignoreInvitation: `${BASE_URL}/communities/ignoreCommunityInvitation`,
  leaveCommunity: `${BASE_URL}/communities/exit-community/`, // /:idCommunity
  deleteCommunity: `${BASE_URL}/communities/delete-community/`, // /:idCommunity
  /* ======= Notifications ======= */
  getNotifications10By10: `${BASE_URL}/notifications`, //     /:idUser
  getNotificationsNotReaded: `${BASE_URL}/notifications/New`, //     /:idUser
  markIsReadNotifications: `${BASE_URL}/notifications/MarkIsRead`, //     /:idNotification
  /* ======= Balance ======= */
  getBalance: `${BASE_URL}/balances/get-balance`,
  dailyBonus: `${BASE_URL}/premium-plans/Statistics`,
  SendCoins: `${BASE_URL}/premium-plans/transfer`,
  bonusCoins: `${BASE_URL}/balances/bonus-coins`,
  deductCoins: `${BASE_URL}/balances/deduct-coins`,
  /* ======= ChatGPT ======= */
  sendMasgageToChatGPT: `${BASE_URL}/chatRoutes/chatBot`,
  /* ======= Reports ======= */
  AddReportUser: `${BASE_URL}/report/report`,
  getMyReports: `${BASE_URL}/report/user-reports`,
  /* ======= History ======= */
  SeeYourHistory: `${BASE_URL}/history/getmyhistory`,
  /* ======= Premium ======= */
  subscribePlan: `${BASE_URL}/premium-plans/subscribe`,
  getUserPlanById: `${BASE_URL}/premium-plans/PlanType`, //     /:idUser
  currentUserPlanExpiration: `${BASE_URL}/premium-plans/premium/expiration`,
  ghostMode: `${BASE_URL}/premium-plans/ghost-mode`,
};
