import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDBNfAj8Pp2RqdX1dNnWvvp_1M_U3HSp80",
    authDomain: "lr10-react-xno.firebaseapp.com",
    databaseURL: "https://lr10-react-xno-default-rtdb.firebaseio.com",
    projectId: "lr10-react-xno",
    storageBucket: "lr10-react-xno.firebasestorage.app",
    messagingSenderId: "1009459818960",
    appId: "1:1009459818960:web:a8551fef35af3fcff809d5",
    measurementId: "G-N17Q019RTV"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
