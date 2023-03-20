import { useState, useEffect, useContext } from "react";
import { CHIFOUMI } from "./../../utils/enums/Chifoumi";
import { Link } from "react-router-dom";
import { RoomContext } from "../../utils/context/RoomContext";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

// make an objet with results per player, then order those to display them in a table
function orderTableForResults(results) {
    const resultsPerPlayer = {};
    for (let user in results[0]) resultsPerPlayer[user] = [];

    let maxRounds = 0;
    for (let i = 0; i < results.length; i++) {
        let j = 0;
        for (let user in results[i]) {
            resultsPerPlayer[user].push(results[i][user]);
            if (maxRounds < j + 1) {
                maxRounds = j + 1;
            }
            j++;
        }
    }
    // add empty for rounds where player is dead
    Object.keys(resultsPerPlayer).forEach((element) => {
        if (resultsPerPlayer[element].length - 1 < maxRounds) {
            let newArray = resultsPerPlayer[element];
            for (
                let index = resultsPerPlayer[element].length - 1;
                index < maxRounds;
                index++
            ) {
                newArray.push(false);
            }
            resultsPerPlayer[element] = newArray;
        }
    });
    return resultsPerPlayer;
}

function ResultMove() {
    const [tableResults, setTableResults] = useState({});
    const [winners, setWinners] = useState([]);

    const { room } = useContext(RoomContext);

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
                    setTableResults(orderTableForResults(element.rounds));
                    setWinners(element.winners);
                }
            });
        });
    }, [tableResults]);

    return (
        <div>
            <h2>Round results</h2>
            <h3>
                {winners.length == 0 ? (
                    <span>No winner this round</span>
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
                <Link to="/rooms">
                    <button>Quit</button>
                </Link>
            </div>
        </div>
    );
}

export default ResultMove;
