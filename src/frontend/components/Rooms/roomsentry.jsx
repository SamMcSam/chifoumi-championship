import "./roomsentry.css";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { RoomContext } from "../../utils/context/RoomContext";
import { UserContext } from "../../utils/context/UserContext";
import io from "socket.io-client";
const socket = io("http://localhost:5000", { path: "/server" });

const RoomsEntry = ({ id, name, players, state }) => {
    const { user } = useContext(UserContext);
    const { enterRoom } = useContext(RoomContext);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        enterRoom(formData.get("room"));
        socket.emit("enterRoom", {
            roomName: formData.get("room"),
            userName: user,
        });
        navigate("/lobby");
    }
    return (
        <tr>
            <td>{name}</td>
            <td>{players.length}</td>
            <td>
                {state == "waiting" ? (
                    <span className="waiting">Waiting</span>
                ) : (
                    <span className="playing">Playing...</span>
                )}
            </td>
            <td>
                <form onSubmit={handleSubmit}>
                    <input name="room" type="hidden" value={name} />
                    <button type="submit" disabled={state != "waiting"}>
                        🚪Enter
                    </button>
                </form>
            </td>
        </tr>
    );
};

export default RoomsEntry;
