import { useState, useEffect } from "react";

const CurrentUserCount = () => {
    const [currentCount, setCurrentCount] = useState([]);

    useEffect(() => {
        // @todo get from socket
        const count = Math.floor(Math.random() * 10);
        setCurrentCount(count);
    }, []);

    return (
        <div>
            <span>Current connected users :&nbsp;</span>
            <span>{currentCount}</span>
        </div>
    );
};

export default CurrentUserCount;
