import { useState, useEffect } from "react";

const PlayersList = () => {
    const [playersList, setPlayersList] = useState([]);
    const [isDataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        setDataLoading(true);
        // @todo fetch from socket
        setPlayersList([
            { name: "Bob", status: true },
            { name: "John", status: false },
            { name: "Annette", status: true },
        ]);
        setDataLoading(false);
    }, []);

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
