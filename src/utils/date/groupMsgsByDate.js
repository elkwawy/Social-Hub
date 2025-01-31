export const groupMessagesByDate = (messages) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const grouped = messages?.reduce((acc, msg) => {
        const msgDate = new Date(msg.timestamp);
        let formattedDate;

        if (msgDate.toDateString() === today.toDateString()) {
            formattedDate = "Today";
        } else if (msgDate.toDateString() === yesterday.toDateString()) {
            formattedDate = "Yesterday";
        } else {
            formattedDate = msgDate.toLocaleDateString();
        }

        if (!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push(msg);
        return acc;
    }, {});
    return grouped;
};