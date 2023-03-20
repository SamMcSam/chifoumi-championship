import { useContext, useState } from "react";
import { UserContext } from "../../utils/context/UserContext";
import { useNavigate } from "react-router";
import io from "socket.io-client";
const socket = io("http://localhost:5000", { path: "/server" });

const SignupForm = () => {
    const { saveName } = useContext(UserContext);
    const [isEnabled, setEnabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        saveName(formData.get("name"));

        socket.emit("newUser", { name: formData.get("name") });
        setEnabled(false);
        setErrorMessage("");

        socket.on("confirmAction", () => {
            navigate("/rooms");
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
                    Enter your name
                    <input type="text" name="name" />
                </label>
                <button type="submit" disabled={!isEnabled}>
                    Play!
                </button>
            </form>
        </div>
    );
};

export default SignupForm;
