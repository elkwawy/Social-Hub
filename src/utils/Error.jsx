import { memo } from 'react'

const Error = memo(({error, fontSize=''}) => {
    return (
        <p className={`text-center ${fontSize} text-gray-500 font-semibold h-full flex items-center justify-center`}>
            {
                (
                    error == "Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted. Make sure your current IP address is on your Atlas cluster's IP whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/"
                    || error == "getaddrinfo ENOTFOUND cluster0-shard-00-01.kzkh3.mongodb.net"
                    || error.length > 50
                )
                ? "Network Error"
                : error
            }
        </p>
    )
});

export default Error