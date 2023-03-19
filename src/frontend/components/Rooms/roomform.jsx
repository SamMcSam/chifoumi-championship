import { useContext } from "react";
import { useNavigate } from "react-router";
import { RoomContext } from "../../utils/context/RoomContext";

const RoomsForm = () => {
    const { enterRoom } = useContext(RoomContext);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        enterRoom(formData.get("roomName"));
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
