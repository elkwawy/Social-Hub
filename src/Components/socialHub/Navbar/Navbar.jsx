import { useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import PlansActionsHook from "../../../Hooks/PlansActionsHook";
import Coins from "./Coins";
import DailyBonus from "./DailyBonus";
import Notifications from "./Notifications";
import UserDetails from "./UserDetails";
const Navbar = ({ toggleSidebar }) => {
  const { getUserPlan, userPlan } = PlansActionsHook();
  const { user, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    getUserPlan();
  }, []);
  
  return (
    <nav className="bg-white shadow-sm border-b max-sm:space-y-4 sm:h-[74.2px] border-gray-200 px-6 py-4">
      <div className="flex items-center justify-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800 lg:hidden focus:outline-none mt-1"
          >
            <FaBars size={25} />
          </button>
          <div className="max-sm:hidden">
            <Coins title="" className="" />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="max-sm:hidden">
            <DailyBonus />
          </div>

        
          <div className="max-sm:hidden">
            <Notifications />
          </div>

          <UserDetails user={user} status={status} userPlan={userPlan} />
        </div>
      </div>
      <div className="flex items-center justify-between sm:hidden">
        <Coins title="" className="" />
        <div className="flex items-center space-x-6 max-[340px]:space-x-4">
          <DailyBonus />
          <Notifications />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
