import React, { useContext } from "react";
import { UserContext } from "../../utils/context";
import { useNavigate } from "react-router";

const SignupForm = () => {
    const { saveName } = useContext(UserContext);

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        console.log(formData.get("name"));
        saveName(formData.get("name"));
        navigate("/game");
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
