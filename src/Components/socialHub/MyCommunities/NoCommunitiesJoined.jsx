import { MdAddHomeWork } from "react-icons/md";

const NoCommunitiesJoined = ({handleOpenCreateCommunityModal}) => {
    return (
        <div className="text-center w-full my-32 flex gap-3 items-center justify-center flex-col h-full">
            <MdAddHomeWork className="text-[150px] text-main-color" />
            <p className="text-gray-500 font-semibold">
                You have not joined or created any communities yet.
            </p>
            <button
            onClick={handleOpenCreateCommunityModal}
            className="mt-4 text-xs trans bg-main-color hover:bg-sec-color text-white py-2 px-4 rounded-md"
            >
                Create Community
            </button>
        </div>
    )
}

export default NoCommunitiesJoined