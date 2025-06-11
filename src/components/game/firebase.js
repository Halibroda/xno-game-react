import { ref, push, set, onValue} from "firebase/database";
import { db } from "../../initFirebase";

export const saveGameResult = (result) => {
    const gamesRef = ref(db, 'results');
    return push(gamesRef, {
        winner: result.winner,
        timestamp: Date.now()
    });
};


export const postMove = (gameId, move) =>
    push(ref(db, `games/${gameId}/moves`), move);

export const listenMoves = (gameId, callback) => {
    const movesRef = ref(db, `games/${gameId}/moves`);
    onValue(movesRef, snapshot => callback(snapshot.val()));
};

export const clearMoves = gameId =>
    set(ref(db, `games/${gameId}/moves`), null);
