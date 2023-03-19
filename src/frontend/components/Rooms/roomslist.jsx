import { useState, useEffect } from "react";
import { ROOMSTATE } from "./../../utils/enums/RoomState";
import RoomsEntry from "./roomsentry";

import "./roomslist.css";

const RoomsList = () => {
    const [roomList, setRoomList] = useState([]);
    const [isDataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        setDataLoading(true);
        // @todo fetch from socket
        setRoomList([
            { name: "free for all", players: [], state: ROOMSTATE.Waiting },
            { name: "another one", players: [], state: ROOMSTATE.Waiting },
            { name: "yet an other", players: [], state: ROOMSTATE.Voting },
            { name: "private", players: [], state: ROOMSTATE.Waiting },
        ]);
        setDataLoading(false);
    }, []);

    return (
        <div>
            <h3>Rooms:</h3>
            {isDataLoading ? (
                <div>Loading ↻</div>
            ) : (
                <table>
                    <tbody>
                        <tr>
                            <td>Room</td>
                            <td>Nb. Players</td>
                            <td>State</td>
                            <td></td>
                        </tr>
                        {roomList.map((room, index) => (
                            <RoomsEntry
                                key={index}
                                name={room.name}
                                players={room.players}
                                state={room.state}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RoomsList;
