import CurrentUserCount from "../../components/Rooms/currentusercount";
import RoomForm from "../../components/Rooms/roomform";
import RoomsList from "../../components/Rooms/roomslist";
import { useUserVerification } from "../../utils/hooks/useUserVerification";
import { useContext } from "react";
import { UserContext } from "../../utils/context/UserContext";
import { Link } from "react-router-dom";

function Rooms() {
    const { user } = useContext(UserContext);
    useUserVerification();

    // @todo test if really a new user in socket

    return (
        <div>
            <h1>Select a room to play in</h1>
            <h2>Playing as '{user}'</h2>
            <CurrentUserCount></CurrentUserCount>
            <RoomsList></RoomsList>
            <RoomForm></RoomForm>
            <Link to="/">
                <button>Return</button>
            </Link>
        </div>
    );
}

export default Rooms;
