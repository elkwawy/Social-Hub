import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProfileAndCover from "../../../Components/socialHub/Profile/ProfileAndCover";
import UserInfo from "../../../Components/socialHub/Profile/UserInfo";
import Tabs from "../../../Components/socialHub/Profile/Tabs";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { API } from "../../../Api/Api";
import { showToast } from "../../../Utils/showToast";
import { useSelector } from "react-redux";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const pathSegments = useMemo(
    () => location.pathname.split("/"),
    [location.pathname, id]
  );

  const edit = useMemo(() => id === Cookies.get("userID"), [id]);

  const fetchUserById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API.getUserById}/${id}`);
      setUser(response.data);
    } catch (error) {
      showToast("error", "Error fetching user data");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserById();
  }, [id]);
  const currentTab = useMemo(() => pathSegments[4] || null, [pathSegments]);

  return (
    <div className="-m-2">
      <ProfileAndCover user={user} loading={loading} edit={edit} />
      <UserInfo
        user={user}
        loading={loading}
        edit={edit}
        fetchUserById={fetchUserById}
      />
      <Tabs openTab={currentTab} id={id} edit={edit} />
      <Outlet context={{ user, edit, loading, fetchUserById }} />
    </div>
  );
};

export default Profile;
