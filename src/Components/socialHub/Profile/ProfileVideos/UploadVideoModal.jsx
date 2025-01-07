import React, { memo, useCallback, useRef, useState } from 'react';
import { Img } from 'react-image';
import Skeleton from 'react-loading-skeleton';
import { formatFileSize, isValidUrl, isVideoURL } from '../../../../Utils/validateURLs';
import { IoMdAdd } from "react-icons/io";
import AddNewTagModal from '../../MainPage/EditVideo/AddNewTagModal';
import Loader from '../../../../Utils/Loader';
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import Cookies from 'js-cookie';

const UploadVideoModal = memo(({uploadVideo, addVideoLoading}) => {
    const [imgURL, setImgURL] = useState("");
    const [addNewTagModal, setAddNewTagModal] = useState(false);
    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        videoURL: "",
        thumbnailURL: "",
        tags: [],
    });
    const [errors, setErrors] = useState({});
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleInputsChange = useCallback(
        (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
        },
        [setInputs, setErrors]
    );

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInputs((prev) => ({ ...prev, videoFile: file }));
            setErrors((prev) => ({ ...prev, videoURL: "" })); // Clear errors if file is selected
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
    

    const handleAddVideo = () => {
        if (isValidInputs()) {
            const details = {
                userId: Cookies.get("userID") ,
                title: inputs.title,
                // videoUrl: inputs.videoURL || null, // Keep the URL if provided
                videoFile: inputs.videoFile, // Add the file for upload
                thumbnailUrl: inputs.thumbnailURL,
                description: inputs.description,
                tags: inputs.tags,
            };
            uploadVideo(details);
        }
    };

    const isValidInputs = () => {
        const fieldErrors = {};
        Object.entries(inputs).forEach(([name, value]) => {
        const error = validateField(name, value);
        if (error) fieldErrors[name] = error;
        });
        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };

    const validateField = (name, value) => {
        let error = "";
        if (name === "title" || name === "description") {
            if (!value) error = `Enter a ${name}`;
        } else if (name === "videoURL" && !inputs.videoFile) {
            if (!value) error = "Upload video";
            else if (!isValidUrl(value) || !isVideoURL(value)) error = "Invalid video URL";
        } else if (name === "thumbnailURL") {
            if (!value) error = "Enter thumbnail URL";
            else if (!isValidUrl(value)) error = "Invalid thumbnail URL";
        else {
            const img = new Image();
            img.onload = () => setImgURL(value);
            img.onerror = () => setImgURL("");
            img.src = value;
        }
        }
        return error;
    };
    const handleOpenAddNewTag = () => setAddNewTagModal(true);
    const handleCloseAddNewTag = () => setAddNewTagModal(false);
    const handleAddNewTag = (tagName) => setInputs({ ...inputs, tags: [...inputs.tags, tagName] });
    const handleRemoveTag = (index) => setInputs({...inputs, tags: inputs.tags.filter((_, i) => i!== index) });
    const handleUploadFile = () => {
        if (fileInputRef && fileInputRef.current)   
            fileInputRef.current?.click()
    }
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);  // Set dragging to true when a file enters the drag area
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);  // Set dragging to false when a file leaves the drag area
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setInputs((prev) => ({ ...prev, videoFile: file }));
            setErrors((prev) => ({ ...prev, videoURL: "" })); // Clear errors if file is dropped
        }
    };

    console.log(inputs);
    
    const handleRemoveFile = () => { 
        setInputs({...inputs, videoFile:null});
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
                } onError={() => setImgURL("")} /> : <div onClick={focusOnThumbnailInput} className='w-full select-none cursor-pointer h-48 rounded-md bg-gray-200 flex items-center justify-center text-sm' >Add Video Thumbnail</div> 
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
            {/* Video upload */}
            <div className="flex flex-col items-start gap-1 cursor-pointer">
                <div className='flex justify-between items-center w-full'>
                    <span className="text-sm font-medium text-gray-700">
                        Upload Video:
                    </span>
                    {errors.videoURL && (
                        <div className="text-xs p-1 rounded-sm bg-red-100 text-red-500 font-semibold">
                        {errors.videoURL}
                        </div>
                    )}
                </div>
                {!inputs?.videoFile && <div
                    id="dragArea"
                    onClick={handleUploadFile}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`w-full ${dragging && !inputs.videoFile ? "bg-gray-200" : "bg-gray-50"} trans p-4 border-2 text-sm text-gray-400 ${inputs?.videoFile ? "border-2 " : "border-dashed border-main-color "} rounded-md  flex flex-col items-center`}
                >
                    {!inputs?.videoFile && <IoCloudUploadOutline className="text-3xl mb-1" />}
                    {inputs?.videoFile && <IoCloudUploadOutline  className="text-xl ml-auto -mt-2 mb-1" />}
                    {!inputs?.videoFile && <p className=''>Drag and drop <span className="text-main-color">or</span> click to upload</p>}
                    {inputs?.videoFile && <p className=' break-all text-center text-xs mt-2'>{inputs.videoFile?.name || "Uknown Video Name"}</p>}

                </div>}
                
                <input
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {
                inputs?.videoFile && 
                <div className='w-full p-2 -mt-3 flex flex-col bg-gray-50 border-2  rounded-md'>
                    <button onClick={handleRemoveFile} className='ml-auto trans  p-1 rounded-md hover:bg-gray-200'>
                        <IoMdClose className='text-main-color' />
                    </button>
                    <div className='w-full text-left text-wrap'>
                        <p className='text-sm '>{inputs?.videoFile.name.length <= 100 ? inputs?.videoFile.name : inputs?.videoFile.name.slice(0,100) + "..."}</p>
                    </div>
                    <p className='text-left text-xs mt-2 text-gray-500'>{formatFileSize(inputs.videoFile.size)}</p>
                </div>
            }

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
                Upload Video
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

export default UploadVideoModal;