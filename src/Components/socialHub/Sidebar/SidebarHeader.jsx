import { FaTimes } from "react-icons/fa";

const SidebarHeader = ({ onClose }) => {
  return (
    <div className="p-[20.7px] flex items-center justify-between border-b-2 border-h-bg1">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-main-color rounded-lg flex items-center justify-center">
          <span className=" font-bold text-xl">S</span>
        </div>
        <h2 className="text-xl font-bold ">Social Hub</h2>
      </div>
      {/*  <div className="flex items-center space-x-2">
    <LazyImage src={logo} alt="Logo" className="w-24" />
    </div>*/}
      <button
        onClick={onClose}
        className="lg:hidden text-gray-400 hover:text-c-black transition-colors"
      >
        <FaTimes size={20} />
      </button>
    </div>
  );
};

export default SidebarHeader;
