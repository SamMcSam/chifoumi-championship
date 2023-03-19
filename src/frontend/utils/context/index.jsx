import React, { useState, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const saveName = (name) => {
    setUser(name);
  };

  return (
    <UserContext.Provider value={{ user, saveName }}>
      {children}
    </UserContext.Provider>
  );
};

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState({});
  const enterRoom = (newRoom) => {
    setRoom(newRoom);
  };

  return (
    <RoomContext.Provider value={{ room, enterRoom }}>
      {children}
    </RoomContext.Provider>
  );
};
