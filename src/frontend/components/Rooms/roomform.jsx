import { useContext } from "react";
import { useNavigate } from "react-router";
import { RoomContext } from "../../utils/context/RoomContext";
import { UserContext } from "../../utils/context/UserContext";
import io from "socket.io-client";
const socket = io("http://localhost:5000", { path: "/server" });

const RoomsForm = () => {
    const { user } = useContext(UserContext);
    const { enterRoom } = useContext(RoomContext);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        enterRoom(formData.get("roomName"));
        socket.emit("createRoom", {
            roomName: formData.get("roomName"),
            user: user,
        });
        navigate("/lobby");
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Room name
                <input type="text" name="roomName" />
            </label>
            <button type="submit">Create</button>
        </form>
    );
};

export default RoomsForm;
