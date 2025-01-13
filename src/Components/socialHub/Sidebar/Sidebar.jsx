import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaSignOutAlt,
  FaClipboard,
  FaUserFriends,
} from "react-icons/fa";
import { TbMessagePlus } from "react-icons/tb";
import { FaArrowTrendUp } from "react-icons/fa6";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { TbMessages } from "react-icons/tb";
import { RiCommunityLine } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import SidebarHeader from "./SidebarHeader";
import SidebarItem from "./SidebarItem";
import { useDispatch } from "react-redux";
import sweetalert from "./../../../Utils/sweetalert";
import { logUserOut } from "../../../Redux/slices/userSlice";
import React from "react";
import { useSelector } from "react-redux";
const Sidebar = React.memo(({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.user);

  const location = useLocation();

  const dispatch = useDispatch();
  const handleLogout = async () => {
    if (user.isGhost) {
      sweetalert.info(
        "You cannot log out currently because you are in ghost mode. Please turn off ghost mode to be able to log out."
      );
      return;
    } else {
      const result = await sweetalert.logout();
      if (result.isConfirmed) dispatch(logUserOut());
    }
  };

  const menuItems = [
    { icon: FaHome, text: "Main Page", path: "/socialHub", scr: "/socialHub" },
    {
      icon: FaArrowTrendUp,
      text: "Trending",
      path: "trending",
      scr: "/socialHub/trending",
    },
    {
      icon: FaUsers,
      text: "People",
      path: "people",
      scr: "/socialHub/people",
    },
    {
      icon: BiSolidCategoryAlt,
      text: "Plans",
      path: "plans",
      scr: "/socialHub/plans",
    },
    {
      icon: TbMessages,
      text: "My Messages",
      path: "myMessages",
      scr: "/socialHub/myMessages",
    },
    {
      icon: RiCommunityLine,
      text: "Communities",
      path: "myCommunities",
      scr: "/socialHub/myCommunities",
    },
    {
      icon: TbMessagePlus,
      text: "Beta Bot AI",
      path: "betaBotAi",
      scr: "/socialHub/betaBotAi",
    },
    {
      icon: FaClipboard,
      text: "Reports",
      path: "reports",
      scr: "/socialHub/reports",
    },
  ];

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300
          lg:hidden ${
            isOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
          }
        `}
      />
      <div
        className={`
        fixed top-0 left-0 h-full bg-c-bg1 text-c-black w-[225px] 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 shadow-xl
      `}
      >
        <SidebarHeader onClose={onClose} />
        <nav className="mt-6">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink key={item.text} to={item.path}>
                <SidebarItem
                  icon={item.icon}
                  text={item.text}
                  isActive={location.pathname === item.scr}
                />
              </NavLink>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="absolute bottom-0 w-full border-t-2 border-h-bg1 p-4 cursor-pointer"
          >
            <SidebarItem icon={FaSignOutAlt} text="Logout" />
          </button>
        </nav>
      </div>
    </>
  );
});

export default Sidebar;
