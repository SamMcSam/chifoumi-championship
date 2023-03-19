import CurrentUserCount from "../../components/Rooms/currentusercount";
import RoomForm from "../../components/Rooms/roomform";
import RoomsList from "../../components/Rooms/roomslist";

function Rooms() {
    return (
        <div>
            <CurrentUserCount></CurrentUserCount>
            <RoomsList></RoomsList>
            <RoomForm></RoomForm>
        </div>
    );
}

export default Rooms;
