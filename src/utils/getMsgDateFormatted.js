export const getMsgDateFormatted = (timestamp) => { 
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12:00 PM is 12, not 0
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${hours}:${minutes} ${ampm}`;
    return timeString;
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
        date.toDateString() === today.toDateString()
    ) {
        return "Today";
    }

    if (
        date.toDateString() === yesterday.toDateString()
    ) {
        return "Yesterday";
    }

    return date.toLocaleDateString();
};
