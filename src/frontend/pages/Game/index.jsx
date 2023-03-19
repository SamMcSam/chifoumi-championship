import { useContext, useEffect } from "react";
import { UserContext } from "../../utils/context";
import { useNavigate } from "react-router-dom";

function Game() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // @todo put in hook everywhere
    useEffect(() => {
        if (user === "") {
            navigate("/");
        }
    });

    return <h1>{user}</h1>;
}

export default Game;
