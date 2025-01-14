import { showToast } from "./showToast";

export const copyURL = (url,msg) => { 
    if (url) {
        navigator.clipboard.writeText(url)
        .then(() => {
            showToast('success', msg);
        })
        .catch(() => {
            showToast( "error", msg);
        });
    }
}