import { useContext } from "react";
import { UserContext } from "../../utils/context/UserContext";
import { useNavigate } from "react-router";
import io from "socket.io-client";
const socket = io("http://localhost:5000", { path: "/server" });

const SignupForm = () => {
    const { saveName } = useContext(UserContext);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        saveName(formData.get("name"));
        socket.emit("newUser", { name: formData.get("name") });
        navigate("/rooms");
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter your name
                <input type="text" name="name" />
            </label>
            <button type="submit">Play!</button>
        </form>
    );
};

export default SignupForm;
