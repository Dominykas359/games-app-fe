import React, { useEffect, useState } from "react";
import { PlayerModel } from "../../../models/PlayerModel";
import GameHeader from "../../misc/GameHeader";
import { updatePlayer } from "../../../api/PlayerApi";
import { fetchByPlayerAndGame, updateGamePoints } from "../../../api/GamePointsApi";
import "./styles/TicTacToe.css";

const TicTacToe: React.FC = () => {
    const [player, setPlayer] = useState<PlayerModel | null>(null);
    const [board, setBoard] = useState<(string | null)[]>(() => {
        const savedBoard = localStorage.getItem('board');
        return savedBoard ? JSON.parse(savedBoard) : Array(9).fill(null);
    });
    const [isXNext, setIsXNext] = useState<boolean>(() => {
        const savedIsXNext = localStorage.getItem('isXNext');
        return savedIsXNext ? JSON.parse(savedIsXNext) : true;
    });
    const [winner, setWinner] = useState<string | null>(null);
    const [isTie, setIsTie] = useState<boolean>(() => {
        const savedIsTie = localStorage.getItem('isTie');
        return savedIsTie ? JSON.parse(savedIsTie) : false;
    });

    useEffect(() => {
        const initializePlayer = async () => {
            const data = localStorage.getItem('user');
            if (data) {
                setPlayer(JSON.parse(data));
            }
        };
        initializePlayer();
    }, []);

    useEffect(() => {
        localStorage.setItem('board', JSON.stringify(board));
        localStorage.setItem('isXNext', JSON.stringify(isXNext));
        localStorage.setItem('isTie', JSON.stringify(isTie));
        localStorage.setItem('winner', JSON.stringify(winner));

        // Cleanup function to clear localStorage when component unmounts
        return () => {
            localStorage.removeItem('board');
            localStorage.removeItem('isXNext');
            localStorage.removeItem('winner');
            localStorage.removeItem('isTie');
        };
    }, [board, isXNext, isTie, winner]);

    useEffect(() => {
        if (!isXNext && !winner && !isTie) {
            const bestMove = getBestMove(board);
            handleClick(bestMove);
        }
    }, [isXNext, winner, isTie, board]);

    const handleClick = async (index: number): Promise<void> => {
        if (board[index] || winner || isTie) return;

        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const gameWinner = calculateWinner(newBoard);
        if (gameWinner) {
            setWinner(gameWinner);
            if (gameWinner === 'X') {
                await updatePoints(10);
            } else {
                await updatePoints(-10);
            }
        } else if (!newBoard.includes(null)) {
            setIsTie(true);
        }
    };

    const calculateWinner = (board: (string | null)[]): string | null => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return null;
    };

    const handleReset = (): void => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setIsTie(false);
        localStorage.removeItem('board');
        localStorage.removeItem('isXNext');
        localStorage.removeItem('winner');
        localStorage.removeItem('isTie');
    };

    const getBestMove = (board: (string | null)[]): number => {
        let bestVal = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let moveVal = minimax(board, 0, false);
                board[i] = null;
                if (moveVal > bestVal) {
                    bestMove = i;
                    bestVal = moveVal;
                }
            }
        }

        return bestMove;
    };

    const minimax = (board: (string | null)[], depth: number, isMax: boolean): number => {
        const winner = calculateWinner(board);

        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (!board.includes(null)) return 0;

        if (isMax) {
            let best = -Infinity;

            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = 'O';
                    best = Math.max(best, minimax(board, depth + 1, false));
                    board[i] = null;
                }
            }

            return best;
        } else {
            let best = Infinity;

            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = 'X';
                    best = Math.min(best, minimax(board, depth + 1, true));
                    board[i] = null;
                }
            }

            return best;
        }
    };

    const updatePoints = async (points: number) => {
        if (player) {
            const updatedPlayer = { ...player, points: player.points + points };
            const response = await updatePlayer(player.id, updatedPlayer);
            setPlayer(response);

            // Update game points if necessary
            const gamePoints = await fetchByPlayerAndGame("a196a4d1-08cb-4a26-9e17-769f6c4daec2", player.id);
            const updatedGamePoints = { ...gamePoints, points: gamePoints.points + points };
            await updateGamePoints(gamePoints.id, updatedGamePoints);

            localStorage.setItem('user', JSON.stringify(response));
        }
    };

    return (
        <>
            <GameHeader points={player?.points || 0} />
            <div className="tic-tac-toe-container">
                <h1>Tic Tac Toe</h1>
                <div className="choices-container">
                    {board.map((value, index) => (
                        <button className="choose-button" key={index} onClick={() => handleClick(index)}>
                            {value}
                        </button>
                    ))}
                </div>
                {winner && (
                    <div>
                        <h2>{winner === 'X' ? "You won!" : "Computer won!"}</h2>
                        <button className="restart-button" onClick={handleReset}>Restart Game</button>
                    </div>
                )}
                {isTie && (
                    <div>
                        <h2>It's a tie!</h2>
                        <button className="restart-button" onClick={handleReset}>Restart Game</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default TicTacToe;
