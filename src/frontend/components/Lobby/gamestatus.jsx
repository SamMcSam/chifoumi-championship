import { useState, useContext, useEffect } from "react";
import { RoomContext } from "../../utils/context/RoomContext";

import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

const GameStatus = () => {
    const [message, setMessage] = useState("Waiting for more players...");

    const { room } = useContext(RoomContext);

    useEffect(() => {
        socket.on("listRooms", ({ rooms }) => {
            rooms.forEach((element) => {
                if (element.name === room) {
                    if (Object.keys(element.users).length > 1) {
                        let okayToGo = true;
                        Object.keys(element.users).forEach((key) => {
                            if (!element.users[key]) {
                                okayToGo = false;
                            }
                        });

                        setMessage(
                            okayToGo
                                ? "Waiting for admin to launch the game..."
                                : "Waiting for players to get ready..."
                        );
                    } else {
                        setMessage("Waiting for more players...");
                    }
                }
            });
        });
    }, [message]);

    return <h3>{message}</h3>;
};

export default GameStatus;
