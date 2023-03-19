import { useState, useEffect } from "react";

function WinnerMove() {
    const [winners, setWinners] = useState([]);
    useEffect(() => {
        // @todo by socket
        setWinners(["alice"]);
    }, []);
    return (
        <h3>
            {winners.length == 0 ? (
                <span>No winner this round</span>
            ) : winners.length == 1 ? (
                <span>Winner : {winners.toString()}</span>
            ) : (
                <span>Winners : {winners.toString()}</span>
            )}
        </h3>
    );
}

export default WinnerMove;
