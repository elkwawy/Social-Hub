import React, { memo, useRef, useState } from 'react';
import { Img } from 'react-image';
import Skeleton from 'react-loading-skeleton';
import { isValidUrl, isVideoURL } from '../../../../Utils/validateURLs';
import { IoMdAdd } from "react-icons/io";
import AddNewTagModal from '../../MainPage/EditVideo/AddNewTagModal';
import Loader from '../../../../Utils/Loader';

const AddNewVideoModal = memo(({addVideo, addVideoLoading}) => {
  const [imgURL, setimgURL] = useState("");
  const [addNewTagModal, setAddNewTagModal] = useState(false);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    videoURL: "",
    thumbnailURL: "",
    tags: [],
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    videoURL: "",
    thumbnailURL: "",
  });
  

  const handleInputsChange = (e) => {
    const { name, value } = e.target;

    // Update the input value
    setInputs({ ...inputs, [name]: value });
    
    // Handle changes specifically for thumbnailURL
    if (name === "thumbnailURL") {
      // Clear image URL and errors if the input is empty
      if (!value) {
        setimgURL("");
        setErrors({ ...errors, [name]: "" });
        return;
      }

      // Validate the URL format
      if (!isValidUrl(value)) {
        setErrors({ ...errors, [name]: "Invalid URL format" });
        setimgURL("");
        return;
      }

      // Check if it's a video URL
      if (isVideoURL(value)) {
        setErrors({ ...errors, [name]: "Appears to be a video link" });
        setimgURL("");
        return;
      }

      // Validate if it's an image URL
      const img = new Image();
      img.onload = () => {
        setimgURL(value); // Valid image
        setErrors({ ...errors, [name]: "" }); // Clear errors
      };
      img.onerror = () => {
        setErrors({ ...errors, [name]: "Invalid thumbnail URL" });
        setimgURL("");
      };
      img.src = value; // Trigger image loading
    }
    else if (name === "description") {
      if (!value) { 
        setErrors({...errors, [name]: "Enter a description" });
      } else { 
        setErrors({...errors, [name]: "" });
      }
    }
    else if (name === "title") { 
      if (!value) { 
        setErrors({...errors, [name]: "Enter a title" });
      } else { 
        setErrors({...errors, [name]: "" });
      }
    }
    else if (name === "videoURL") { 
      const videoURLError = checkVideoURL(value);
      if (videoURLError) { 
        setErrors({...errors, [name]: videoURLError });
      } else { 
        setErrors({...errors, [name]: "" });
      }
    }
  };

  const thumbnailRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const focusOnDescInput = () => { 
    if (descRef && descRef.current){
      descRef.current.focus();
    }
  }
  const focusOnTitleInput = () => { 
    if (titleRef && titleRef.current){
      titleRef.current.focus();
    }
  }
  const focusOnThumbnailInput = () => { 
    if (thumbnailRef && thumbnailRef.current){
      thumbnailRef.current.focus();
    }
  }
  
  const checkVideoURL = (url) => { 
    if (!url) { 
      return "Enter video URL"
    }
    else if (!isValidUrl(url)) {
      return "Invalid Video URL"
    } else { 
      if (!isVideoURL(url)) { 
        return "Invalid Video URL"
      }
    }
  }
  const isValidInputs = () => { 
    let isValid = true;
    let errors = {
      title: "",
      videoURL: "",
      description: "",
      thumbnailURL: "",
    };
    if (!inputs.title) { 
      errors.title = "Enter a title"
      isValid = false;
    }
    if (!inputs.description) { 
      errors.description = "Enter a description"
      isValid = false;
    }
    const videoURLError = checkVideoURL(inputs.videoURL);
    if (videoURLError) { 
      errors.videoURL = videoURLError;
      isValid = false;
    }
    if (!inputs.thumbnailURL) { 
      errors.thumbnailURL = "Enter thumbnail URL"
      isValid = false;
    }
    else if (!isValidUrl(inputs.thumbnailURL)) {
      errors.thumbnailURL = "Invalid thumbnail URL"
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  }

  const handleAddVideo = () => { 
    if(isValidInputs()) { 
      const details = {
        "title" : inputs.title,
        "videoUrl" : inputs.videoURL,
        "thumbnailUrl" : inputs.thumbnailURL,
        "description" : inputs.description,
        "tags":inputs.tags,
      }
      addVideo(details);
    }
  }
  const handleOpenAddNewTag = () => { 
      setAddNewTagModal(true);
  }
  const handleCloseAddNewTag = () => { 
      setAddNewTagModal(false);
  }
  const handleAddNewTag = (tagName) => {
      setInputs({ ...inputs, tags: [...inputs.tags, tagName] });
  };
  const handleRemoveTag = (index) => { 
      setInputs({...inputs, tags: inputs.tags.filter((_, i) => i!== index) });
  }

  return (
    <div className='grid md:grid-cols-2 gap-8'>
      {/* Live seeing  */}
      <div className='flex sm:max-w-full flex-col items-start gap-4'>
        {/* Image */}
        {
          (imgURL && !errors.thumbnailURL) 
          ? <Img src={inputs.thumbnailURL} className='max-w-full h-48 rounded-md'loader={
              <div className="w-full h-48 animate-pulse">
                <Skeleton height="100%" width="100%" borderRadius={"4px"} />
              </div>
            } onError={() => setimgURL("")} /> : <div onClick={focusOnThumbnailInput} className='w-full select-none cursor-pointer h-48 rounded-md bg-gray-200 flex items-center justify-center text-sm' >Add Video Thumbnail</div> 
        }
        <p onClick={focusOnTitleInput} className='text-sm select-none cursor-pointer ml-2 text-gray-600 text-start max-w-full text-wrap break-words'>{inputs.title ? inputs.title : "Add the video title right here" }</p>
        {/* video tags */}
        {
            <div className='flex max-w-full text-wrap gap-1 ml-2 items-center'>
                {inputs.tags && inputs.tags.length > 0 ?
                    <div className='flex max-w-full flex-wrap gap-1 items-center'>
                        {inputs.tags.map((tag, index) => (
                            <span key={index} onClick={() => handleRemoveTag(index)} className="p-2 text-xs cursor-pointer trans hover:bg-sec-color text-gray-600  bg-gray-50 rounded-sm">
                                {tag}
                            </span>
                        ))}
                        <button onClick={handleOpenAddNewTag} className="p-2 text-xs cursor-pointer trans hover:bg-gray-100 rounded-sm">
                            <IoMdAdd className='text-lg text-main-color' />
                        </button>
                    </div>
                    : 
                    <div className='flex items-center gap-1 flex-wrap'>
                        <span  className="p-2 text-xs  text-gray-800 bg-gray-50 rounded-sm">
                            Not tags added
                        </span>
                        <button onClick={handleOpenAddNewTag} className="p-2 text-xs cursor-pointer trans hover:bg-gray-100 rounded-sm">
                            <IoMdAdd className='text-lg text-main-color' />
                        </button>
                    </div>
                }
            </div>
        }
        <div onClick={focusOnDescInput} className='select-none cursor-pointer ml-2 p-2 bg-gray-50 border  text-gray-600 w-full rounded-md flex items-center justify-start'>
          <p className='text-xs max-w-full text-start text-wrap break-words'>{inputs.description ? inputs.description :"Add video description"}</p>
        </div>
      </div>

      {/* Inputs */}
      <div className='flex flex-col gap-4'>
        {/* Video URL */}
        <label className='flex flex-col items-start gap-1 cursor-pointer'>
          <span className=' select-none text-sm font-medium w-full flex items-center justify-center text-gray-700'>
            <p className='mr-auto'>Video URL:</p>
            {errors.videoURL && <div className='text-xs p-1 rounded-sm bg-red-100 text-red-500 font-semibold'>{errors.videoURL}</div>}
          </span>
          <input 
            type='text' 
            name='videoURL'
            value={inputs.videoURL}
            onChange={handleInputsChange}
            className={`w-full p-2 outline-1 border-2 rounded-md bg-gray-50 focus:outline-gray-400`}
            placeholder="Enter video video URL" 
          />

        </label>
        {/* Thumbnail */}
        <label className='flex flex-col items-start gap-1 cursor-pointer'>
          <span className=' select-none text-sm font-medium w-full flex items-center justify-center text-gray-700'>
            <p className='mr-auto'>Thumbnail URL:</p>
            {errors.thumbnailURL && <div className='text-xs p-1 rounded-sm bg-red-100 text-red-500 font-semibold'>{errors.thumbnailURL}</div>}
          </span>
          <input 
            type='text' 
            name='thumbnailURL'
            ref={thumbnailRef}
            value={inputs.thumbnailURL}
            onChange={handleInputsChange}
            className={`w-full p-2 outline-1 border-2 rounded-md bg-gray-50 focus:outline-gray-400`}
            placeholder="Enter thumbnail URL" 
          />

        </label>
        {/* Video title */}
        <label className='flex flex-col items-start gap-1 cursor-pointer'>
          <span className=' select-none text-sm font-medium w-full flex items-center justify-center text-gray-700'>
            <p className='mr-auto'>Title:</p>
            {errors.title && <div className='text-xs p-1 rounded-sm bg-red-100 text-red-500 font-semibold'>{errors.title}</div>}
          </span>
          <input 
            type='text' 
            name='title'
            ref={titleRef}
            value={inputs.title}
            onChange={handleInputsChange}
            className={`w-full p-2 outline-1 border-2 rounded-md bg-gray-50 focus:outline-gray-400`}
            placeholder="Enter video title" 
          />

        </label>
        {/* Video desc */}
        <label className='flex flex-col items-start gap-1 cursor-pointer'>
          <span className=' select-none text-sm font-medium w-full flex items-center justify-center text-gray-700'>
            <p className='mr-auto'>Description:</p>
            {errors.description && <div className='text-xs p-1 rounded-sm bg-red-100 text-red-500 font-semibold'>{errors.description}</div>}
          </span>
          <input 
            type='text' 
            name='description'
            ref={descRef}
            value={inputs.description}
            onChange={handleInputsChange}
            className={`w-full p-2 outline-1 border-2 rounded-md bg-gray-50 focus:outline-gray-400`}
            placeholder="Enter video description" 
          />
        </label>

        
        {!addVideoLoading && <button onClick={handleAddVideo} className="ml-auto text-sm bg-main-color px-3 py-2 text-white trans hover:bg-sec-color rounded-md ">
            Add Video
        </button>}
        { 
          addVideoLoading && 
          <div className="ml-auto text-sm w-[89px] flex items-center justify-center py-2 text-white  ">
            <Loader width={"24px"} />
          </div>
        }
      </div>
      {
          addNewTagModal && 
          <AddNewTagModal 
              handleAddNewTag={handleAddNewTag}
              handleCloseTagModal={handleCloseAddNewTag}
          />
      }
    </div>
  )
})

export default AddNewVideoModal;