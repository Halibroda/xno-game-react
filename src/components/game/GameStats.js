import React, { useEffect, useState } from "react";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "../../initFirebase";

const GameStats = () => {
    const [games, setGames] = useState([]);
    const [totalStats, setTotalStats] = useState({ X: 0, O: 0, Draw: 0 });

    useEffect(() => {
        const resultsRef = ref(db, "results");

        const lastGamesQuery = query(resultsRef, limitToLast(5));
        onValue(lastGamesQuery, snapshot => {
            const data = snapshot.val() || {};
            const gameList = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
            setGames(gameList);
        });

        onValue(resultsRef, snapshot => {
            const data = snapshot.val() || {};
            const stats = { X: 0, O: 0, Draw: 0 };
            Object.values(data).forEach(game => {
                if (game.winner in stats) stats[game.winner]++;
            });
            setTotalStats(stats);
        });
    }, []);

    return (
        <div className="stats-container">
            <h3>Останні 5 ігор:</h3>
            <ul className="stats-list">
                {games.map((game, index) => (
                    <li key={index}>
                        Результат: <strong>{game.winner}</strong><br />
                        Час: {new Date(game.timestamp).toLocaleString()}
                    </li>
                ))}
            </ul>

            <h3>Загальна статистика:</h3>
            <div className="total-stats">
                <p>Перемог X: {totalStats.X}</p>
                <p>Перемог O: {totalStats.O}</p>
                <p>Нічиїх: {totalStats.Draw}</p>
            </div>
        </div>
    );
};

export default GameStats;
