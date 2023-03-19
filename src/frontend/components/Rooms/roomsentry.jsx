import "./roomsentry.css";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { RoomContext } from "../../utils/context/RoomContext";

const RoomsEntry = ({ id, name, players, state }) => {
    const { enterRoom } = useContext(RoomContext);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        enterRoom(formData.get("room"));
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
                    <button type="submit">Enter</button>
                </form>
            </td>
        </tr>
    );
};

export default RoomsEntry;
