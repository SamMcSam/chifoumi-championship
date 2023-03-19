import React, { useState, createContext } from "react";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [room, setRoom] = useState("");
    const enterRoom = (newRoom) => {
        setRoom(newRoom);
    };

    return (
        <RoomContext.Provider value={{ room, enterRoom }}>
            {children}
        </RoomContext.Provider>
    );
};
