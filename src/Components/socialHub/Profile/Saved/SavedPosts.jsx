import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSavedPosts } from "../../../../Redux/slices/postsReducer";
import Loader from "../../../../Utils/Loader";
import PostCard from "../Posts/PostCard";

const SavedPosts = memo(({edit}) => {
    const {savedPosts, savedLoading:loading, savedError:error} = useSelector((state) => state.posts);
    
    const dispatch = useDispatch();

    useEffect(() => { 
        dispatch(getSavedPosts());
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
                    return <PostCard key={post._id} isSaved={true} post={post} user={user} edit={edit} />
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