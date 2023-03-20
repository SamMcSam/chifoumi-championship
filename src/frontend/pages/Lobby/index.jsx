import { useUserVerification } from "../../utils/hooks/useUserVerification";
import { useLobbyVerification } from "../../utils/hooks/useLobbyVerification";
import { useContext, useEffect } from "react";
import { UserContext } from "../../utils/context/UserContext";
import { RoomContext } from "../../utils/context/RoomContext";
import PlayerStatus from "../../components/Lobby/playerstatus";
import PlayersList from "../../components/Lobby/playerlist";
import PlayButton from "../../components/Lobby/playbutton";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:5000", { path: "/server" });

function Lobby() {
    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);

    const navigate = useNavigate();

    useUserVerification();
    useLobbyVerification();

    const handleClick = (e) => {
        socket.emit("quitLobby", { roomName: room, userName: user });
        navigate("/rooms");
    };

    useEffect(() => {
        socket.on("listRooms", ({ rooms }) => {
            rooms.forEach((element) => {
                if (element.name === room && element.state !== "waiting") {
                    navigate("/game");
                }
            });
        });
    }, []);

    return (
        <div>
            <h1>Lobby</h1>
            <h2>
                Welcome to room '{room}'. Playing as '{user}'
            </h2>
            <PlayersList></PlayersList>
            <PlayerStatus></PlayerStatus>
            <PlayButton></PlayButton>
            <button onClick={handleClick}>Return</button>
        </div>
    );
}

export default Lobby;
