import { useState } from "react";

const PlayerStatus = () => {
    const [okStatus, setOkStatus] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        // @todo send signal to socket
        console.log(1);
        setOkStatus(true);
    }

    return okStatus ? (
        <div>You are ready to play ✅</div>
    ) : (
        <div>
            <span>Are you ready to play?</span>&nbsp;
            <button
                onClick={(e) => {
                    handleSubmit(e);
                }}
            >
                ☑️
            </button>
        </div>
    );
};

export default PlayerStatus;
