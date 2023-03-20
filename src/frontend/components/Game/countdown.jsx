import { useState, useEffect } from "react";

function Countdown() {
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => setTimer(timer - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    return <h3>{timer >= 0 ? timer.toString() : "0"}</h3>;
}

export default Countdown;
