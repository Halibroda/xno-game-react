import React from "react";
import { FirebaseProvider } from "./firebase/context";
import Game from "./components/game/Game";

function App() {
    return (
        <FirebaseProvider>
            <Game />
        </FirebaseProvider>
    );
}

export default App;
