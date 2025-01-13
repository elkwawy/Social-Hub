import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';

import axios from "axios";
import Cookies from "js-cookie";
import { API } from "../../Api/Api";
import { showToast } from "../../Utils/showToast";

const GoogleLoginAuth = () => {
    const handleLoginSuccess = async (response) => {
        // e.preventDefault(); 
        console.log("success", response);
        const userData = jwtDecode(response.credential);
        const userDetails = {
        name: userData.name,
        email: userData.email,
        img: userData.picture,
        }
        try {
            const res = await axios.post(API.googleAuth, userDetails);
            console.log(res);
            if (res.data.success) {
                Cookies.set("userID", res.data.user.id);
                window.location.href = "/socialHub";
            }
        } catch (error) {
            showToast("error", error?.response?.data?.message || "Something went wrong");
        }
    }
    
    const handleLoginFailure = (error) => { 
        showToast("error", error || "Something went wrong");
    }

    return (
        <div className="mt-4 w-fit mx-auto">
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
            />
        </div>
    )
}

export default GoogleLoginAuth