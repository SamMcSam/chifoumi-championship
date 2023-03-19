import { useState, useContext } from "react";
import { UserContext } from "../../utils/context/UserContext";
import { RoomContext } from "../../utils/context/RoomContext";
import { useUserVerification } from "../../utils/hooks/useUserVerification";
import { useLobbyVerification } from "../../utils/hooks/useLobbyVerification";
import NextMove from "../../components/Game/nextmove";
import ResultMove from "../../components/Game/resultmove";

function Game() {
    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);

    const [isResult, setResult] = useState(false);

    useUserVerification();
    useLobbyVerification();

    // @todo get current state from socket

    return (
        <div>
            <h1>Let's Chifoumi!</h1>
            {isResult ? <ResultMove /> : <NextMove />}

            {/* Remove this with socket */}
            <div>
                <button onClick={() => setResult(!isResult)}>
                    DEBUG : next
                </button>
            </div>
        </div>
    );
}

export default Game;
