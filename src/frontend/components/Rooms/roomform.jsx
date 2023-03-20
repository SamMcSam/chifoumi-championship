import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { RoomContext } from "../../utils/context/RoomContext";
import { UserContext } from "../../utils/context/UserContext";
import io from "socket.io-client";
const socket = io("http://localhost:5000", { path: "/server" });

const RoomsForm = () => {
    const { user } = useContext(UserContext);
    const { enterRoom } = useContext(RoomContext);
    const [isEnabled, setEnabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        socket.emit("createRoom", {
            roomName: formData.get("roomName"),
            userName: user,
        });
        setEnabled(false);
        setErrorMessage("");

        socket.on("confirmAction", () => {
            enterRoom(formData.get("roomName"));
            navigate("/lobby");
        });

        socket.on("error", ({ message }) => {
            console.error(message);
            setErrorMessage(message);
            setEnabled(true);
        });
    }

    return (
        <div>
            {errorMessage !== "" ? <div>{errorMessage}</div> : null}
            <form onSubmit={handleSubmit}>
                <label>
                    Room name
                    <input type="text" name="roomName" />
                </label>
                <button type="submit" disabled={!isEnabled}>
                    Create
                </button>
            </form>
        </div>
    );
};

export default RoomsForm;
