export const isVideoURL = (url) => {
    const videoPatterns = [
    /youtube\.com\/watch\?v=[^&]+/, // Matches YouTube video links with "?v="
    /youtu\.be\/[^?]+/,             // Matches YouTube shortened links
    /vimeo\.com\/\d+/               // Matches Vimeo video links with numbers
    ];
    
    const isPlaylist = /youtube\.com\/playlist\?list=[^&]+/; // Detects YouTube playlist links

    // Check if it matches a video pattern and is not a playlist
    return videoPatterns.some((pattern) => pattern.test(url)) && !isPlaylist.test(url);
};
export const isValidUrl = (url) => {
    try {
        new URL(url); // Checks if the URL is valid
        return true;
    } catch (error) {
        return false;
    }
};

export const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
        return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 ** 2) {
        return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else if (sizeInBytes < 1024 ** 3) {
        return `${(sizeInBytes / 1024 ** 2).toFixed(2)} MB`;
    } else {
        return `${(sizeInBytes / 1024 ** 3).toFixed(2)} GB`;
    }
};