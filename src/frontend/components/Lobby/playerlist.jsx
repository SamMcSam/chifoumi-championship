import { useState, useEffect, useContext } from "react";
import { RoomContext } from "../../utils/context/RoomContext";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

const PlayersList = () => {
    const [playersList, setPlayersList] = useState([]);
    const [isDataLoading, setDataLoading] = useState(true);

    const { room } = useContext(RoomContext);

    /*
    [
        { name: "Bob", status: true },
        { name: "John", status: false },
        { name: "Annette", status: true },
    ]
    */
    const updatePlayerList = (lobby) => {
        setPlayersList(
            Object.keys(lobby.users).map((key) => {
                return { name: key, status: lobby.users[key] };
            })
        );
    };
    useEffect(() => {
        setDataLoading(true);
        socket.emit("getLobby", { roomName: room }, (response) => {
            if (response.lobby) {
                setDataLoading(false);
                updatePlayerList(response.lobby);
            }
        });
    }, []);
    useEffect(() => {
        socket.on("listRooms", ({ rooms }) => {
            rooms.forEach((element) => {
                if (element.name == room) {
                    setDataLoading(false);
                    updatePlayerList(element);
                }
            });
        });
    }, [playersList]);

    return (
        <div>
            {isDataLoading ? (
                <div>Loading ↻</div>
            ) : (
                <table>
                    <tbody>
                        <tr>
                            <td>Player</td>
                            <td>Ready?</td>
                        </tr>
                        {playersList.map((player, index) => (
                            <tr key={player.name}>
                                <td>{player.name}</td>
                                <td>
                                    {player.status === "ready"
                                        ? "✅"
                                        : player.status === "not-ready"
                                        ? "❌"
                                        : "💀"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PlayersList;
