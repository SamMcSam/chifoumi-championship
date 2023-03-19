import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";

export function useLobbyVerification() {
    const { room } = useContext(RoomContext);
    const navigate = useNavigate();

    useEffect(() => {
        // @todo check if exist in server
        if (room === "") {
            navigate("/rooms");
        }
    });
}
