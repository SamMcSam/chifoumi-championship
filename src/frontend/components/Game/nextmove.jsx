import { useState } from "react";
import { CHIFOUMI } from "./../../utils/enums/Chifoumi";

import "./nextmove.css";

function NextMove() {
    const [nextMove, setNextMove] = useState(null);

    const doMove = (move) => {
        setNextMove(move);
    };

    return (
        <div>
            <h2>Your move...</h2>
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
