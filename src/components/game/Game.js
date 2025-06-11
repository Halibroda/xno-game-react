import React, { useState, useEffect, useRef } from "react";
import { postMove, listenMoves, clearMoves, saveGameResult} from "./firebase";
import './Game.css';
import GameStats from "./GameStats";

export default function Game() {
    const [gameId] = useState("game1");
    const [moves, setMoves] = useState([]);
    const currentPlayer = moves.length % 2 === 0 ? "X" : "O";
    const [winner, setWinner] = useState(null);
    const [winningCombo, setWinningCombo] = useState([]);
    const [isDraw, setIsDraw] = useState(false);
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        listenMoves(gameId, data => {
            if (data) {
                const result = Object.values(data);
                setMoves(result);
            } else {
                setMoves([]);
                setWinner(null);
                setWinningCombo([]);
                setIsDraw(false);
            }
        });
    }, [gameId]);

    const handleClick = index => {
        if (winner || isDraw) return;
        if (moves.find(m => m.index === index)) return;

        const player = moves.length % 2 === 0 ? "X" : "O";
        const newMove = { index, player };

        postMove(gameId, newMove).then(() => {
            const updatedMoves = [...moves, newMove];
            const winResult = checkWinner(updatedMoves);

            if (winResult) {
                setWinner(winResult.winner);
                setWinningCombo(winResult.winningCombo);
            } else if (updatedMoves.length === 9) {
                setIsDraw(true);
            }
        });
    };


    const handleReset = () => {
        if (winner || isDraw) {
            const result = winner ? winner : "Draw";
            saveGameResult({ winner: result });
        }

        clearMoves(gameId);
        setWinner(null);
        setWinningCombo([]);
        setIsDraw(false);
    };

    const checkWinner = (moves) => {
        const winCombos = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6],
        ];

        const board = Array(9).fill(null);
        moves.forEach(({ index, player }) => {
            board[index] = player;
        });

        for (let combo of winCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { winner: board[a], winningCombo: combo };
            }
        }

        return null;
    };


    return (
        <div  className="game-container">
            <h1>Гра Хрестики-Нулики</h1>
            {winner && (
                <div className={`winner-label ${winner.toLowerCase()}`}>
                    Переможець: {winner}
                </div>
            )}
            {!winner && !isDraw && (
                <div className={`current-player-label ${currentPlayer.toLowerCase()}`}>
                    Зараз ходить: {currentPlayer}
                </div>
            )}
            {isDraw && !winner && <h2>Нічия!</h2>}
            <div  className="board" >
                {Array(9).fill(null).map((_, i) => {
                    const move = moves.find(m => m.index === i);
                    const playerClass = move?.player === "X" ? "x" : move?.player === "O" ? "o" : "";

                    let extraClass = "";
                    if (winner) {
                        extraClass = winningCombo.includes(i) ? "winning" : "dimmed";
                    } else if (isDraw) {
                        extraClass = "dimmed";
                    }

                    const classNames = `${extraClass} ${playerClass}`.trim();

                    return (
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            disabled={!!move || winner || isDraw}
                            className={classNames}
                        >
                            {move ? move.player : ""}
                        </button>

                    );
                })}
            </div>
            <br />
            <button className="ui-button" onClick={handleReset}>Закінчити гру</button><br/>
            <button className="ui-button" onClick={() => setShowStats(!showStats)}>
                {showStats ? "Сховати статистику" : "Показати статистику"}
            </button>

            {showStats && <GameStats />}
        </div>
    );
}
