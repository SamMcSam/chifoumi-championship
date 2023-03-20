import { useState, useEffect, useContext } from "react";
import { RoomContext } from "../../utils/context/RoomContext";
import { UserContext } from "../../utils/context/UserContext";
import { useNavigate } from "react-router";

import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

const PlayButton = () => {
    const [canPlay, setCanPlay] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);

    const navigate = useNavigate();

    const handleClick = (e) => {
        navigate("/lobby");
    };

    useEffect(() => {
        socket.on("listRooms", ({ rooms }) => {
            rooms.forEach((element) => {
                if (element.name === room) {
                    setAdmin(element.admin === user);
                }
            });
        });
    }, []);
    useEffect(() => {
        socket.on("listRooms", ({ rooms }) => {
            rooms.forEach((element) => {
                if (element.name === room) {
                    let okayToGo = true;
                    Object.keys(element.users).forEach((key) => {
                        if (!element.users[key]) {
                            okayToGo = false;
                        }
                    });
                    setCanPlay(okayToGo);
                }
            });
        });
    }, [canPlay]);

    return (
        <div>
            {isAdmin ? (
                <button disabled={!canPlay} onClick={handleClick}>
                    ✊🤚✌️ Launch the game!
                </button>
            ) : (
                <></>
            )}
        </div>
    );
};

export default PlayButton;
