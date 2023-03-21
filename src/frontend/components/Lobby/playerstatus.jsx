import { useState, useContext } from "react";
import { UserContext } from "../../utils/context/UserContext";
import { RoomContext } from "../../utils/context/RoomContext";

import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

const PlayerStatus = () => {
    const [okStatus, setOkStatus] = useState(false);

    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);

    function handleSubmit(e) {
        e.preventDefault();
        socket.emit(
            "readyInLobby",
            { roomName: room, userName: user },
            (response) => {
                if (response.done) {
                    setOkStatus(true);
                } else {
                    // @todo error handling here?
                }
            }
        );
    }

    return okStatus ? (
        <div>You are ready to play ✅</div>
    ) : (
        <div>
            <span>Are you ready to play?</span>&nbsp;
            <button
                onClick={(e) => {
                    handleSubmit(e);
                }}
            >
                ☑️
            </button>
        </div>
    );
};

export default PlayerStatus;
