import { useState, useEffect } from "react";

import io from "socket.io-client";
const socket = io("http://localhost:5000", { path: "/server" });

const CurrentUserCount = () => {
    const [currentCount, setCurrentCount] = useState([]);

    useEffect(() => {
        socket.emit("getCount", (response) => {
            setCurrentCount(response.nbUsers);
        });
    }, []);
    useEffect(() => {
        socket.on("userCount", ({ nbUsers }) => {
            setCurrentCount(nbUsers);
        });
    }, [currentCount]);

    return (
        <div>
            <span>Current connected users :&nbsp;</span>
            <span>{currentCount.toString()}</span>
        </div>
    );
};

export default CurrentUserCount;
