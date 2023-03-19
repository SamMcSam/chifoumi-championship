import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export function useUserVerification() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // @todo check if exist in server
        if (user === "") {
            navigate("/");
        }
    });
}
