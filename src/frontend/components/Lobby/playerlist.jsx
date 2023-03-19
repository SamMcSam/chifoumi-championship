import { useState, useEffect, useContext } from "react";
import { RoomContext } from "../../utils/context/RoomContext";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

const PlayersList = () => {
    const [playersList, setPlayersList] = useState([]);
    const [isDataLoading, setDataLoading] = useState(false);

    const { room } = useContext(RoomContext);

    // useEffect(() => {
    //     setDataLoading(true);
    //     // @todo fetch from socket
    //     setPlayersList([
    //         { name: "Bob", status: true },
    //         { name: "John", status: false },
    //         { name: "Annette", status: true },
    //     ]);
    //     setDataLoading(false);
    // }, []);
    useEffect(() => {
        // @todo
    }, [playersList]);

    return (
        <div>
            <h3>Players:</h3>
            {isDataLoading ? (
                <div>Loading ↻</div>
            ) : (
                <table>
                    <tbody>
                        <tr>
                            <td>Player</td>
                            <td>Ready to play?</td>
                        </tr>
                        {playersList.map((player, index) => (
                            <tr>
                                <td>{player.name}</td>
                                <td>{player.status ? "✅" : "❌"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PlayersList;
