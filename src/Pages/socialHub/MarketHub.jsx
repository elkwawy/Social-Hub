import React, { useState } from "react";
import { FaThumbsUp, FaEye, FaComment } from "react-icons/fa"; // Icons from React Icons
import MarketActionsHook from "../../Hooks/MarketActionsHook";

const MarketHub = () => {
  const { incrementLikes, incrementViews, incrementComments } =
    MarketActionsHook();

  // State to store quantities and keys
  const [likeQuantity, setLikeQuantity] = useState(1);
  const [viewQuantity, setViewQuantity] = useState(1);
  const [commentQuantity, setCommentQuantity] = useState(1);
  const [postKey, setPostKey] = useState("");
  const [videoKey, setVideoKey] = useState("");
  const [objectKey, setObjectKey] = useState("");

  // Item prices
  const likePrice = 10;
  const viewPrice = 5;
  const commentPrice = 8;

  // Calculate total cost
  const totalLikeCost = likeQuantity * likePrice;
  const totalViewCost = viewQuantity * viewPrice;
  const totalCommentCost = commentQuantity * commentPrice;

  // Function to handle purchase
  const handlePurchase = (type, quantity, key) => {
    switch (type) {
      case "like":
        incrementLikes(key, quantity);
        break;
      case "view":
        incrementViews(key, quantity);
        break;
      case "comment":
        incrementComments(key, quantity);
        break;
      default:
        break;
    }
  };
  

  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Market Hub</h1>

      <div className="space-y-8">
        {/* Likes Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center mb-6">
            <FaThumbsUp className="text-sec-color text-3xl mr-4" />
            <h2 className="text-2xl font-semibold text-gray-800">Buy Likes</h2>
          </div>
          <p className="text-gray-600 mb-4">Price: 10 Coins per Like</p>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter Post Key"
              value={postKey}
              onChange={(e) => setPostKey(e.target.value)}
              className="border-2 border-gray-200 p-3 rounded-lg w-full focus:outline-none focus:border-gray-400"
            />
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-start">
              <input
                type="number"
                min="1"
                value={likeQuantity}
                onChange={(e) => setLikeQuantity(parseInt(e.target.value))}
                className="border-2 border-gray-300 p-3 rounded-lg w-28 text-center focus:outline-none focus:border-sec-color focus:ring-1 focus:ring-sec-color"
              />
              <button
                onClick={() => handlePurchase("like", likeQuantity, postKey)}
                className="bg-sec-color hover:bg-main-color text-white px-8 md:ml-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none"
              >
                Buy
              </button>
            </div>
            <p className="text-gray-500 mt-2 text-sm">
              {likeQuantity} Likes = {totalLikeCost} Coins
            </p>
          </div>
        </div>

        {/* Views Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center mb-6">
            <FaEye className="text-sec-color text-3xl mr-4" />
            <h2 className="text-2xl font-semibold text-gray-800">Buy Views</h2>
          </div>
          <p className="text-gray-600 mb-4">Price: 5 Coins per View</p>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter Video Key"
              value={videoKey}
              onChange={(e) => setVideoKey(e.target.value)}
              className="border-2 border-gray-200 p-3 rounded-lg w-full focus:outline-none focus:border-gray-400"
            />
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center">
              <input
                type="number"
                min="1"
                value={viewQuantity}
                onChange={(e) => setViewQuantity(parseInt(e.target.value))}
                className="border-2 border-gray-300 p-3 rounded-lg w-28 text-center focus:outline-none focus:border-sec-color focus:ring-1 focus:ring-sec-color"
              />

              <button
                onClick={() => handlePurchase("view", viewQuantity, videoKey)}
                className="bg-sec-color hover:bg-main-color text-white px-8 md:ml-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none"
              >
                Buy
              </button>
            </div>
            <p className="text-gray-500 mt-2 text-sm">
              {viewQuantity} Likes = {totalViewCost} Coins
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center mb-6">
            <FaComment className="text-sec-color text-3xl mr-4" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Buy Comments
            </h2>
          </div>
          <p className="text-gray-600 mb-4">Price: 8 Coins per Comment</p>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter Post Key"
              value={objectKey}
              onChange={(e) => setObjectKey(e.target.value)}
              className="border-2 border-gray-200 p-3 rounded-lg w-full focus:outline-none focus:border-gray-400"
            />
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center">
              <input
                type="number"
                min="1"
                value={commentQuantity}
                onChange={(e) => setCommentQuantity(parseInt(e.target.value))}
                className="border-2 border-gray-300 p-3 rounded-lg w-28 text-center focus:outline-none focus:border-sec-color focus:ring-1 focus:ring-sec-color"
              />

              <button
                onClick={() =>
                  handlePurchase("comment", commentQuantity, objectKey)
                }
                className="bg-sec-color hover:bg-main-color text-white px-8 md:ml-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none"
              >
                Buy
              </button>
            </div>
            <p className="text-gray-500 mt-2 text-sm">
              {commentQuantity} Likes = {totalCommentCost} Coins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketHub;
