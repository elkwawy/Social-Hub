import { memo } from "react";
import { IoClose } from "react-icons/io5";
const Modal = memo(({children, title, onClose}) => {
    return (
        <>
            <div className="fixed  overflow-y-auto text-center friendsInModal h-full sm:max-h-[80%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-6 sm:p-6  z-[60] bg-white 
                        shadow-lg rounded-md flex flex-col gap-8 w-full min-[400px]:w-10/12 md:w-fit ">
                <div className="w-full  border-b pb-3 items-center flex justify-between gap-5 md:gap-56">
                    {title && <h3 className="md:text-xl w-full md:w-96 font-bold text-left">{title}</h3>}
                    <button onClick={onClose} className="ml-auto trans hover:bg-gray-100 p-1 -mr-1 rounded-md">
                        <IoClose className="text-2xl" />
                    </button>
                </div>
                <div className="text-center">{children}</div>
            </div>
            <div onClick={onClose} className="fixed w-full h-full top-0 left-0 z-50 backdrop-blur-sm bg-black bg-opacity-60" />
        </>
    )
})

export default Modal