
const checkImageUrl = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};
// const checkImageUrl = async (url) => {
//     try {
//         // Check if URL is reachable
//         const response = await fetch(url, { method: "HEAD" });

//         // Ensure the response is OK and content type is an image
//         if (!response.ok || !response.headers.get("content-type")?.startsWith("image")) {
//             return false;
//         }

//         return new Promise((resolve) => {
//             const img = new Image();
//             img.onload = () => resolve(true);
//             img.onerror = () => resolve(false);
//             img.src = url;
//         });
//     } catch (error) {
//         return false; // Handle fetch failures (e.g., network errors)
//     }
// };
const checkImg = async (url) => {
    await checkImageUrl(url).then((isValid) => {
    if (isValid) {
        return true;
    } else {
        return false;
    }
    });
};

export default checkImg