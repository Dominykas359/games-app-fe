import { useEffect, useState } from "react";
import Header from "../misc/Header";
import { GameModel } from "../../models/GameModel";
import { fetchAllGames } from "../../api/GameApi";
import "./styles/Titles.css";
import "./styles/GameCard.css";
import { useNavigate } from "react-router-dom";

function Games(){

    const[games, setGames] = useState<GameModel[] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllGames()
            .then(gamesData => {
                setGames(gamesData);
            })
    }, []);

    const handleGameClick = (gameId: string) => {
        navigate(`/games/${gameId}`);
    };

    return(
        <>
            <Header />
            <div className="page-title">
                
                <div>
                    <h1>Games</h1>
                </div>
                <div>
                    {games ? (
                        <div className="game-container">
                            {games.map(game => (
                                <div key={game.id}  className="game-card" onClick={() => handleGameClick(game.id)}>
                                    <img className="game-picture" src="game.png"></img>
                                    <h6>{game.title}</h6>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Loading games...</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Games;