import { useState, useContext } from "react";
import { CHIFOUMI } from "./../../utils/enums/Chifoumi";
import Countdown from "./countdown";
import { RoomContext } from "../../utils/context/RoomContext";
import { UserContext } from "../../utils/context/UserContext";

import "./nextmove.css";

import io from "socket.io-client";

const socket = io("http://localhost:5000", { path: "/server" });

function NextMove() {
    const [nextMove, setNextMove] = useState(null);

    const { user } = useContext(UserContext);
    const { room } = useContext(RoomContext);

    const doMove = (move) => {
        setNextMove(move);
        socket.emit("makeMove", {
            userName: user,
            roomName: room,
            move: move,
        });
    };

    return (
        <div>
            <h2>Your move...</h2>
            <Countdown></Countdown>
            {nextMove != null ? (
                <div>
                    <button
                        disabled="true"
                        className={
                            nextMove === CHIFOUMI.Rock ? "selectedBtn" : null
                        }
                    >
                        {CHIFOUMI.Rock}
                    </button>
                    <button
                        disabled="true"
                        className={
                            nextMove === CHIFOUMI.Paper ? "selectedBtn" : null
                        }
                    >
                        {CHIFOUMI.Paper}
                    </button>
                    <button
                        disabled="true"
                        className={
                            nextMove === CHIFOUMI.Scissor ? "selectedBtn" : null
                        }
                    >
                        {CHIFOUMI.Scissor}
                    </button>
                </div>
            ) : (
                <div>
                    <button onClick={(e) => doMove(CHIFOUMI.Rock)}>
                        {CHIFOUMI.Rock}
                    </button>
                    <button onClick={(e) => doMove(CHIFOUMI.Paper)}>
                        {CHIFOUMI.Paper}
                    </button>
                    <button onClick={(e) => doMove(CHIFOUMI.Scissor)}>
                        {CHIFOUMI.Scissor}
                    </button>
                </div>
            )}
            <div>
                <button
                    disabled={nextMove == null}
                    onClick={(e) => doMove(null)}
                >
                    Cancel move
                </button>
            </div>
        </div>
    );
}

export default NextMove;
