import { useUserVerification } from "../../utils/hooks/useUserVerification";
import { useLobbyVerification } from "../../utils/hooks/useLobbyVerification";
import { useState, useContext } from "react";
import { UserContext } from "../../utils/context/UserContext";
import { RoomContext } from "../../utils/context/RoomContext";
import PlayerStatus from "../../components/Lobby/playerstatus";
import PlayersList from "../../components/Lobby/playerlist";
import PlayButton from "../../components/Lobby/playbutton";
import { Link } from "react-router-dom";

function Lobby() {
    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);

    useUserVerification();
    useLobbyVerification();

    return (
        <div>
            <h1>Lobby</h1>
            <h2>
                Welcome to room '{room}'. Playing as '{user}'
            </h2>
            <h3>waiting for other players...</h3>
            <PlayersList></PlayersList>
            <PlayerStatus></PlayerStatus>
            <PlayButton></PlayButton>
            <Link to="/rooms">
                <button>Return</button>
            </Link>
        </div>
    );
}

export default Lobby;
