
const checkImageUrl = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};
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