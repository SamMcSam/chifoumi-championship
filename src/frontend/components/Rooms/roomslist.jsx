import { useState, useEffect } from "react";
import { ROOMSTATE } from "./../../utils/enums/RoomState";
import RoomsEntry from "./roomsentry";
import io from "socket.io-client";
import "./roomslist.css";

const socket = io("http://localhost:5000", { path: "/server" });

const RoomsList = () => {
    const [roomList, setRoomList] = useState([]);
    const [isDataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        socket.on("listRooms", ({ rooms }) => {
            setRoomList(rooms);
        });
    }, [roomList]);

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
                        {typeof roomList === "object" ? (
                            roomList.map((room, index) => (
                                <RoomsEntry
                                    key={room.name}
                                    name={room.name}
                                    players={room.users}
                                    state={room.state}
                                />
                            ))
                        ) : (
                            <></>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RoomsList;
