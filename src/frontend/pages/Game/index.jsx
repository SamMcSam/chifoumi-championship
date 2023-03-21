import { useState, useContext, useEffect } from "react";
import { RoomContext } from "../../utils/context/RoomContext";
import { useUserVerification } from "../../utils/hooks/useUserVerification";
import { useLobbyVerification } from "../../utils/hooks/useLobbyVerification";
import NextMove from "../../components/Game/nextmove";
import ResultMove from "../../components/Game/resultmove";
import PlayerStatus from "../../components/Lobby/playerstatus";
import PlayersList from "../../components/Lobby/playerlist";
import PlayButton from "../../components/Lobby/playbutton";

import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

function Game() {
    const { room } = useContext(RoomContext);

    const [pageStatus, setPageStatus] = useState("playing");

    useUserVerification();
    useLobbyVerification();

    /*
    useEffect(() => {
        socket.emit("getLobby", { roomName: room }, ({ rooms }) => {
            rooms.forEach((element) => {
                if (element.name === room) {
                    setPageStatus(element.state);
                }
            });
        });
    }, []);
    */

    return (
        <div>
            <h1>Let's Chifoumi!</h1>

            <div
                style={{ display: pageStatus === "playing" ? "block" : "none" }}
            >
                <NextMove />
            </div>

            <div
                style={{
                    display:
                        pageStatus === "results" || pageStatus === "done"
                            ? "block"
                            : "none",
                }}
            >
                <ResultMove />
            </div>
            <div
                style={{ display: pageStatus === "results" ? "block" : "none" }}
            >
                <PlayersList></PlayersList>
                <PlayerStatus></PlayerStatus>
                <PlayButton></PlayButton>
            </div>
        </div>
    );
}

export default Game;
