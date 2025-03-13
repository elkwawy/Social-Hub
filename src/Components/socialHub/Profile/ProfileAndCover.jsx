import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import cover from "../../../assets/cover.png";
import profile from "../../../assets/profile.jpg";
import CoverPicture from "./Update/CoverPicture";
import ProfilePicture from "./Update/ProfilePicture";
import { isValidUrl } from "../../../Utils/validateURLs";
import { useEffect, useState } from "react";
import checkImg from "../../../Utils/checkImg";
const ProfileAndCover = ({ user, loading, edit }) => {
  const [coverPicture, setCoverPicture] = useState("start");
  const [profilePicture, setProfilePicture] = useState("start");

  useEffect(() => {
    if (user) {
      setCoverPicture(user.coverPicture);
      setProfilePicture(user.profilePicture);
    }
  }, [user]);
  return (
    <div>
      {/* Cover Image */}
      <div className="relative group">
        {loading || coverPicture === "start" ? (
          <Skeleton height={155} />
        ) : (
          <img
            src={isValidUrl(coverPicture) ? coverPicture :  cover}
            alt="Something Wrong With Cover Picture"
            className="w-full h-[155px] object-cover"
          />
        )}
        {edit && <CoverPicture user={user} setCoverPicture={setCoverPicture} />}
      </div>

      {/* Profile Image */}
      <div className="relative group flex float-end">
        {loading || profilePicture === "start" ? (
          <div className="mr-5 -mt-[60px] ">
            <Skeleton circle height={105} width={105} />
          </div>
        ) : (
          <img
            src={(isValidUrl(profilePicture) && checkImg(profilePicture) )? profilePicture : profile}
            alt="profile"
            className="mr-5 Cover Picture -mt-11 w-20 h-20 sm:-mt-12 sm:w-[105px] sm:h-[105px] lg:w-36 lg:h-36 lg:-mt-20 rounded-full border-2 border-gray-300"
          />
        )}
        {edit && (
          <ProfilePicture user={user} setProfilePicture={setProfilePicture} />
        )}
      </div>
    </div>
  );
};

export default ProfileAndCover;
