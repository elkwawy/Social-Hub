import { memo, useEffect, useState } from "react"
import PostCard from "../Posts/PostCard"
import axios from "axios";
import { API } from "../../../../Api/Api";
import Loader from "../../../../Utils/Loader";

const SavedPosts = memo(({user, edit}) => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");
    useEffect(() => { 
        const getSavedPosts = async () => { 
            try {
                setLoading(true);
                const res = await axios.get(API.getSavedPosts);
                console.log(res.data);
                setSavedPosts(res.data.savedPosts);
            } catch (error) {
                setError(error?.response?.data?.message || "No saved posts.");
                setLoading(false);
            } finally { 
                setLoading(false);
            }
        };
        getSavedPosts();
    }, []);
    
    return (
        savedPosts  && savedPosts.length > 0 ? 
        <div className="w-full max-w-4xl mx-auto px-4 py-7">
            <div className="space-y-4">
                {savedPosts.map((post) => {
                    const user = {
                        _id: post.owner.id,
                        name: post.owner.name,
                        profilePicture: post.owner.profilePicture
                    }
                    return <PostCard key={post._id} post={post} user={user} edit={edit} />
                })}
            </div>
        </div>
        : (!loading ? (
            error ? 
            <div className="text-center text-gray-500 ">{error}</div>
            :
            <div className="text-center text-gray-500 ">No saved posts.</div>
        ) : <div className="w-full h-[250px] flex items-center justify-center">
            <Loader />
        </div>)
    )
})

export default SavedPosts