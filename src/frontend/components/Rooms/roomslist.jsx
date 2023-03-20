import { useState, useEffect } from "react";
import RoomsEntry from "./roomsentry";
import io from "socket.io-client";
import "./roomslist.css";

const socket = io("http://localhost:5000", { path: "/server" });

const RoomsList = () => {
    const [roomList, setRoomList] = useState([]);
    const [isDataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        socket.on("listRooms", ({ rooms }) => {
            setDataLoading(false);
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
                        {typeof roomList === "object" && roomList.length > 0 ? (
                            roomList.map((room, index) => (
                                <RoomsEntry
                                    key={room.name}
                                    name={room.name}
                                    players={Object.keys(room.users)}
                                    state={room.state}
                                />
                            ))
                        ) : (
                            <tr>No rooms yet</tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RoomsList;
