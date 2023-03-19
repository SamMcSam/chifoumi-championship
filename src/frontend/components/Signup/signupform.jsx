import { useContext } from "react";
import { UserContext } from "../../utils/context/UserContext";
import { useNavigate } from "react-router";

const SignupForm = () => {
    const { saveName } = useContext(UserContext);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        saveName(formData.get("name"));
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
