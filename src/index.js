import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { UserProvider } from "./frontend/utils/context/UserContext";
import { RoomProvider } from "./frontend/utils/context/RoomContext";

import Signup from "./frontend/pages/Signup";
import Rooms from "./frontend/pages/Rooms";
import Lobby from "./frontend/pages/Lobby";
import Game from "./frontend/pages/Game";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <UserProvider>
                <RoomProvider>
                    <Routes>
                        <Route index element={<Signup />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/lobby" element={<Lobby />} />
                        <Route path="/game" element={<Game />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </RoomProvider>
            </UserProvider>
        </Router>
    </React.StrictMode>
);
