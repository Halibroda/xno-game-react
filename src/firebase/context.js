import React, { createContext } from "react";
import { db } from "../initFirebase";

export const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => (
    <FirebaseContext.Provider value={{ db }}>
        {children}
    </FirebaseContext.Provider>
);
