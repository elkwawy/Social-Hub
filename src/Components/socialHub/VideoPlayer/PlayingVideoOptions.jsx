import React, { memo, useEffect, useState } from 'react'
import { copyURL } from '../../../Utils/copyURL'
import useSavedItems from '../../../Hooks/ProfileHooks/useSavedItemsHook'
import { useSelector } from 'react-redux';

const PlayingVideoOptions = memo(({video,videoURL}) => {
    const [isVideoSaved, setisVideoSaved] = useState(false);
    const {handleSaveVideo, handleUnsaveVideo} = useSavedItems();
    const {user} = useSelector((state) => state.user);

    useEffect(() => { 
        if (user) { 
            const isSaved = user.savedVideos.some(vid => vid._id === video._id);
            setisVideoSaved(isSaved);
        }
    }, [])

    const handleCopyVideoUrl = () => { 
        copyURL(videoURL)
    }
    const saveVideo = () => { 
        if (video) { 
            handleSaveVideo(video)
            setisVideoSaved(true);
        }
    }
    return (
        <div className='flex gap-2'>
            <button onClick={saveVideo} className={`${isVideoSaved ? " pointer-events-none opacity-50" : ""} select-none flex text-xs  items-center border sm:text-sm gap-0.5 px-1.5 sm:px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 trans`}>
                Save Video
            </button>

            <button onClick={handleCopyVideoUrl} className='flex select-none text-xs items-center border sm:text-sm gap-0.5 px-1.5 sm:px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 trans'>
                Copy URL
            </button>
        </div>
    )
})

export default PlayingVideoOptions;