import { useState, useEffect } from "react";
import { CHIFOUMI } from "./../../utils/enums/Chifoumi";
import WinnerMove from "./winnermove";
import { Link } from "react-router-dom";

// make an objet with results per player, then order those to display them in a table
function orderTableForResults(results) {
    const resultsPerPlayer = {};
    for (let i = 0; i < results[0].length; i++) {
        resultsPerPlayer[results[0][i].user] = [];
    }
    let maxRounds = 0;
    for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < results[i].length; j++) {
            resultsPerPlayer[results[i][j].user].push(results[i][j].move);
            if (maxRounds < j + 1) {
                maxRounds = j + 1;
            }
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
    const [roundResults, setRoundResults] = useState([]);
    const [tableResults, setTableResults] = useState({});

    useEffect(() => {
        // @todo fetch from socket
        const data = [
            [
                { user: "john", move: CHIFOUMI.Paper },
                { user: "phil", move: null },
                { user: "bob", move: CHIFOUMI.Rock },
                { user: "alice", move: CHIFOUMI.Scissor },
            ],
            [
                { user: "john", move: CHIFOUMI.Paper },
                { user: "alice", move: CHIFOUMI.Scissor },
                { user: "bob", move: CHIFOUMI.Rock },
            ],
            [
                { user: "john", move: CHIFOUMI.Scissor },
                { user: "bob", move: CHIFOUMI.Rock },
                { user: "alice", move: CHIFOUMI.Rock },
            ],
            [
                { user: "bob", move: CHIFOUMI.Rock },
                { user: "alice", move: CHIFOUMI.Paper },
            ],
            [{ user: "alice", move: true }], // this one sent by socket at the end as extra
        ];
        setRoundResults(data);
        setTableResults(orderTableForResults(data));
    }, []);

    return (
        <div>
            <h2>Round results</h2>
            <WinnerMove />
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
