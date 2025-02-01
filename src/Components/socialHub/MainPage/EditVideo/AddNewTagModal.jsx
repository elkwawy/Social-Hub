import { useState } from "react"
import Loader from "../../../../Utils/Loader";
import Modal from '../../../../Utils/Modal';
import { showToast } from "../../../../Utils/showToast";


const AddNewTagModal = ({handleAddNewTag, handleCloseTagModal}) => {
    const [tagName, setTagName] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const addNewTag = (e) => { 
        e.preventDefault();
        if (validateTagName()) { 
            // Replace spaces in tagName with dashes
            handleAddNewTag(tagName);
            handleCloseTagModal();
        }
    };

    const validateTagName = () => { 
        if (!tagName) { 
            setError(true);
            showToast("error", "Tag name is required");
            return false
        }
        return true;
    }
    const handleTagNameChange = e => setTagName(e.target.value);
    return (
        <Modal title={"Add New Tag"} onClose={handleCloseTagModal}  >
            <form onSubmit={addNewTag} className="flex  gap-5">
                <input
                    type="text"
                    name="name"
                    value={tagName}
                    onChange={handleTagNameChange}
                    className={`w-3/4 p-2 outline-1 border-2 rounded-md bg-gray-50 ${
                        error
                        ? "outline-red-400 border-red-400"
                        : "focus:outline-gray-400"
                    }  `}
                    placeholder="Enter tag name..."
                />
                {!loading && <button type="submit" className="bg-main-color  trans hover:bg-sec-color px-3 py-2 rounded-md text-white text-xs">Add tag</button>}
                {loading && <div type="submit" className="flex items-center justify-center w-[123px]" ><Loader  /></div>}
            </form>
        </Modal>
    )
}

export default AddNewTagModal