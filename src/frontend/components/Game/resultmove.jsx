import { useState, useEffect, useContext } from "react";
import { CHIFOUMI } from "./../../utils/enums/Chifoumi";
import { Link } from "react-router-dom";
import { RoomContext } from "../../utils/context/RoomContext";
import { UserContext } from "../../utils/context/UserContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

// make an objet with results per player, then order those to display them in a table
function orderTableForResults(room) {
    const resultsPerPlayer = {};
    for (let user in room.users) resultsPerPlayer[user] = [];

    for (let i = 0; i < room.rounds.length; i++) {
        for (let user in room.rounds[i]) {
            resultsPerPlayer[user].push(room.rounds[i][user]);
        }
    }
    // add empty for rounds where player is dead
    for (let user in resultsPerPlayer) {
        if (resultsPerPlayer[user].length < room.rounds.length) {
            for (
                let index = resultsPerPlayer[user].length;
                index < room.rounds.length;
                index++
            ) {
                resultsPerPlayer[user].push(false);
            }
        }
    }
    return resultsPerPlayer;
}

function ResultMove() {
    const [tableResults, setTableResults] = useState({});
    const [winners, setWinners] = useState([]);

    const { user } = useContext(UserContext);
    const { room, enterRoom } = useContext(RoomContext);

    const navigate = useNavigate();

    useEffect(() => {
        /*
        // @todo fetch from socket
        const data = [
            {
                john: CHIFOUMI.Paper,
                phil: null,
                bob: CHIFOUMI.Rock,
                alice: CHIFOUMI.Scissor,
            },
            {
                john: CHIFOUMI.Paper,
                alice: CHIFOUMI.Scissor,
                bob: CHIFOUMI.Rock,
            },
            {
                john: CHIFOUMI.Scissor,
                bob: CHIFOUMI.Rock,
                alice: CHIFOUMI.Rock,
            },
            {
                bob: CHIFOUMI.Rock,
                alice: CHIFOUMI.Paper,
            },
            { alice: true }, // this one sent by socket at the end as extra
        ];
        setTableResults(orderTableForResults(data));
        */
        socket.on("listRooms", ({ rooms }) => {
            rooms.forEach((element) => {
                if (element.name === room) {
                    setTableResults(orderTableForResults(element));
                    setWinners(element.winners);
                }
            });
        });
    }, [tableResults]);

    const handleClick = (e) => {
        e.preventDefault();
        socket.emit("quitLobby", { roomName: room, userName: user });
        enterRoom("");
        navigate("/rooms");
    };

    return (
        <div>
            <h2>Round results</h2>
            <h3>
                {winners.length == 0 ? (
                    <span>No winner this round. Continue!</span>
                ) : winners.length == 1 ? (
                    <span>Winner : {winners.toString()}</span>
                ) : (
                    <span>Winners : {winners.toString()}</span>
                )}
            </h3>
            <table>
                <tbody>
                    {Object.keys(tableResults).map((value, index) => {
                        return (
                            <tr>
                                <td>{value}</td>
                                {tableResults[value].map((val, ind) => {
                                    return (
                                        <td>
                                            {val == null
                                                ? "🚫"
                                                : val == false
                                                ? "💀"
                                                : val == true
                                                ? "🏅"
                                                : val}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div>
                <button onClick={handleClick}>Quit</button>
            </div>
        </div>
    );
}

export default ResultMove;
