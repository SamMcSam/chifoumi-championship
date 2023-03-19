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
