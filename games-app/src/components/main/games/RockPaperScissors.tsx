import { useEffect, useState } from "react";
import { fetchPlayerById, updatePlayer } from "../../../api/PlayerApi";
import { PlayerModel } from "../../../models/PlayerModel";
import GameHeader from "../../misc/GameHeader";
import { GamePointsModel } from "../../../models/GamePointsModel";
import { fetchGamePointById, updateGamePoints } from "../../../api/GamePointsApi";
import "./styles/RockPaperScissors.css";

function RockPaperScissors() {
    const [player, setPlayer] = useState<PlayerModel | null>(null);
    const [computerChoice, setComputerChoice] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [playerChoice, setPlayerChoice] = useState<string>('');
    const [round, setRound] = useState<number>(0);
    const [gamePoints, setGamePoints] = useState<GamePointsModel | null>(null);

    useEffect(() => {
        if (playerChoice) {
            const computerChoose = () => {
                const choice = Math.floor(Math.random() * 3);
                if (choice === 0) setComputerChoice('rock');
                else if (choice === 1) setComputerChoice('paper');
                else setComputerChoice('scissors');
            };
            computerChoose();
        }
    }, [playerChoice, round]);

    useEffect(() => {
        const fetchGamePoints = async() => {

            if(player){
                const gamePointsData = await fetchGamePointById('d62c84a7-27af-40b8-b96d-1b174c0c6448', player.id);
                setGamePoints(gamePointsData);
            }
        }
        fetchGamePoints();
    }, [player]);

    useEffect(() => {
        if (computerChoice) {
            determineWinner(playerChoice, computerChoice);
        }
    }, [computerChoice]);

    const handlePlayerChoice = (choice: string) => {
        setPlayerChoice(choice);
        setComputerChoice('');
        setMessage('');
        setRound(prevRound => prevRound + 1);
    };

    const determineWinner = (playerchoice: string, computer: string) => {
        let resultMessage = '';
        if (playerchoice === computer) {
            resultMessage = "It's a tie!";
        } else if (
            (playerchoice === 'rock' && computer === 'scissors') ||
            (playerchoice === 'paper' && computer === 'rock') ||
            (playerchoice === 'scissors' && computer === 'paper')
        ) {
            resultMessage = 'You win!';
            if(player && gamePoints) {
                player.points += 1;
                gamePoints.points += 1;
            }
        } else {
            resultMessage = 'You lose!';
            if(player && gamePoints) {
                player.points -= 1;
                gamePoints.points -= 1;
                if (player.points < 0) player.points = 0;
            }
        }
        setMessage(resultMessage);
    };

    useEffect(() => {
        const updatePlayerPoints = async () => {
            if(player && message && gamePoints) {
                try {
                    await updatePlayer(player.id, player);
                    await updateGamePoints(gamePoints.id, gamePoints);
                } catch(error) {
                    console.error('Error updating player points:', error);
                }
            }
        };
        updatePlayerPoints();
    }, [message]);

    useEffect(() => {
        const data = localStorage.getItem('user');
        let id = '';

        if (data) {
            const object: PlayerModel = JSON.parse(data);
            id = object.id;
        }

        if (id) {
            fetchPlayerById(id)
                .then(playerData => {
                    setPlayer(playerData);
                })
                .catch(error => {
                    console.error('Error fetching player data:', error);
                });
        } else {
            console.error('No valid ID found in localStorage.');
        }
    }, []);

    let messageStyle = ''; // Default style
    if (message === "It's a tie!") {
        messageStyle = 'tie';
    } else if (message === 'You win!') {
        messageStyle = 'win';
    } else if (message === 'You lose!') {
        messageStyle = 'lose';
    }

    return (
        <>
            <GameHeader points={player?.points || 0} />
            <div className="rock-paper-scissors-container">
                <h1>Rock Paper Scissors</h1>
                <div className="choices">
                    <button className="choice" onClick={() => handlePlayerChoice('rock')}>✊</button>
                    <button className="choice" onClick={() => handlePlayerChoice('paper')}>🫲</button>
                    <button className="choice" onClick={() => handlePlayerChoice('scissors')}>✌️</button>
                </div>
                <div className="messages">
                    <p>Your Choice: {playerChoice}</p>
                    <p>Computer Choice: {computerChoice}</p>
                    <p className={messageStyle}>{message}</p>
                </div>
            </div>
        </>
    );
}

export default RockPaperScissors;
