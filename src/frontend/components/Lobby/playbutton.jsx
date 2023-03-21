import { useState, useEffect, useContext } from "react";
import { RoomContext } from "../../utils/context/RoomContext";
import { UserContext } from "../../utils/context/UserContext";

import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

const PlayButton = () => {
    const [canPlay, setCanPlay] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [message, setMessage] = useState("Waiting for more players...");

    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);

    const handleClick = (e) => {
        e.preventDefault();
        socket.emit("newRound", {
            roomName: room,
        });
    };

    const updateLobbyState = (lobby) => {
        setAdmin(lobby.admin === user); // update admin

        let playersToWait = 0;
        let playersReady = 0;
        Object.keys(lobby.users).forEach((key) => {
            if (
                lobby.users[key] == "ready" ||
                lobby.users[key] == "not-ready"
            ) {
                playersToWait++;
                if (lobby.users[key] == "ready") {
                    playersReady++;
                }
            }
        });
        setCanPlay(playersToWait === playersReady && playersToWait > 1);

        // message
        if (playersToWait > 1) {
            setMessage(
                playersToWait === playersReady
                    ? "Waiting for admin to launch the game..."
                    : "Waiting for players to get ready..."
            );
        } else {
            setMessage("Waiting for more players...");
        }
    };

    useEffect(() => {
        socket.emit("getLobby", { roomName: room }, (response) => {
            if (response.lobby) {
                updateLobbyState(response.lobby);
            }
        });
    }, []);
    useEffect(() => {
        socket.on("listRooms", ({ rooms }) => {
            rooms.forEach((element) => {
                if (element.name === room) {
                    updateLobbyState(element);
                }
            });
        });
    }, [canPlay]);

    return (
        <div>
            <h3>{message}</h3>
            {isAdmin ? (
                <button disabled={!canPlay} onClick={handleClick}>
                    ✊🤚✌️ Launch the game!
                </button>
            ) : (
                <></>
            )}
        </div>
    );
};

export default PlayButton;
