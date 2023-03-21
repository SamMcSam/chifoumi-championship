import CurrentUserCount from "../../components/Rooms/currentusercount";
import RoomForm from "../../components/Rooms/roomform";
import RoomsList from "../../components/Rooms/roomslist";
import { useUserVerification } from "../../utils/hooks/useUserVerification";
import { useContext } from "react";
import { UserContext } from "../../utils/context/UserContext";

function Rooms() {
    const { user } = useContext(UserContext);

    useUserVerification();

    const handleReturn = () => {
        window.location.reload();
    };

    return (
        <div>
            <h1>Select a room to play in</h1>
            <h2>Playing as '{user}'</h2>
            <CurrentUserCount></CurrentUserCount>
            <RoomsList></RoomsList>
            <RoomForm></RoomForm>
            <button onClick={() => handleReturn}>Quit game</button>
        </div>
    );
}

export default Rooms;
