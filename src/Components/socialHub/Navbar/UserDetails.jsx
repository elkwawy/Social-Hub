import profile from "../../../assets/profile.jpg";
import Skeleton from "react-loading-skeleton";
import LazyImage from "../../../Utils/LazyImage";
import { Link } from "react-router-dom";
import { isValidUrl } from "../../../Utils/validateURLs";
const UserDetails = ({ user, status, userPlan }) => {
  return status === "loading" ? (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col justify-center items-center">
        <Skeleton width={100} height={14} />
        <Skeleton width={80} height={12} />
      </div>
      <Skeleton circle width={45} height={45} />
    </div>
  ) : (
    <Link
      to={`profile/${user?._id}`}
      className="flex items-center space-x-3 focus:outline-none"
    >
      <div className="flex flex-col justify-center items-center">
        <span className="text-gray-700 font-medium">{user?.name}</span>
        <span className="text-main-color tracking-[1px] text-sm font-medium">
          {userPlan == null ? "Free Plan" : `${userPlan} Plan`}
        </span>
      </div>
      {user?.profilePicture ? (
        <img
          src={isValidUrl(user.profilePicture) ? user.profilePicture : profile}
          className="w-10 h-10 rounded-full border"
          alt="profilePicture"
        />
      ) : (
        <LazyImage
          src={profile}
          className="w-10 h-10 rounded-full"
          alt="profilePicture"
        />
      )}
    </Link>
  );
};

export default UserDetails;
