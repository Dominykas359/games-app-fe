import { useEffect, useState } from "react";
import Header from "../misc/Header";
import { PlayerModel } from "../../models/PlayerModel";
import { fetchPlayersForLeaderboard, fetchPlayersFromFriendLeaderboard, fetchPlayersFromFriendLeaderboardByPlayer } from "../../api/PlayerApi";
import "./styles/Leaderboard.css";
import { GameModel } from "../../models/GameModel";
import { fetchAllGames } from "../../api/GameApi";
import { fetchByPlayerAndGame, fetchGamePointsByGameId, fetchGamePointsByGameIdFriends, fetchGamePointsByGameIdFriends2 } from "../../api/GamePointsApi";
import { GamePointsModel } from "../../models/GamePointsModel";

function Leaderboard() {
    const [players, setPlayers] = useState<PlayerModel[] | null>(null);
    const [user, setUser] = useState<PlayerModel | null>(null);
    const [playersFromFriends, setPlayersFromFriends] = useState<PlayerModel[] | null>(null);
    const [playersFromFriendsByPlayer, setPlayersFromFriendsByPlayer] = useState<PlayerModel[] | null>(null);
    const [friendPlayers, setFriendPlayers] = useState<PlayerModel[] | null>(null);
    const [friendPlayersPoints, setFriendPlayersPoints] = useState<GamePointsModel[] | null>(null);
    const [games, setGames] = useState<GameModel[] | null>(null);
    const [selectedOption, setSelectedOption] = useState<GameModel | null>(null);
    const [selectedOptionFriends, setSelectedOptionFriends] = useState<GameModel | null>(null);
    const [gamePoints, setGamePoints] = useState<GamePointsModel[] | null>(null);
    const [playersGamePoints, setPlayersGamePoints] = useState<GamePointsModel[] | null>(null);
    const [playersGamePoints2, setPlayersGamePoints2] = useState<GamePointsModel[] | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<GamePointsModel | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playerData = await fetchPlayersForLeaderboard();
                setPlayers(playerData);

                const data = localStorage.getItem('user');
                if (data) {
                    const userData: PlayerModel = JSON.parse(data);
                    setUser(userData);

                    const playerData2 = await fetchPlayersFromFriendLeaderboard(userData.id);
                    setPlayersFromFriends(playerData2);

                    const playerData3 = await fetchPlayersFromFriendLeaderboardByPlayer(userData.id);
                    setPlayersFromFriendsByPlayer(playerData3);

                    // Add logged-in user to the friends leaderboard if not already there
                    
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (playersFromFriends && playersFromFriendsByPlayer) {
            const combinedPlayers = [
                ...(playersFromFriends || []),
                ...(playersFromFriendsByPlayer || []),
                ...(user ? [user] : [])
            ].sort((a, b) => b.points - a.points);
            setFriendPlayers(combinedPlayers);
        }
    }, [playersFromFriends, playersFromFriendsByPlayer, user]);

    useEffect(() => {
        if(playersGamePoints && playersGamePoints2) {
            const combinedPlayers = [
                ...(playersGamePoints || []),
                ...(playersGamePoints2 || []),
                ...(currentPlayer ? [currentPlayer] : [])
            ].sort((a, b) => b.points - a.points);
            setFriendPlayersPoints(combinedPlayers);
        }
    }, [playersGamePoints, playersGamePoints2, currentPlayer]);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const data = await fetchAllGames();
                setGames(data);
                if (data && data.length > 0) {
                    setSelectedOption(data[0]);
                    setSelectedOptionFriends(data[0]);
                }
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchGameData();
    }, []);

    useEffect(() => {
        const fetchGamePointsData = async() => {
            try{
                if(selectedOption){
                    const data = await fetchGamePointsByGameId(selectedOption.id)
                    setGamePoints(data);
                }
            } catch(error){
                console.error("Error fetching game points:", error);
            }
        }
        fetchGamePointsData();
    }, [selectedOption]);

    useEffect(() => {
        const fetchGamePointsFriends = async() => {
            try{
                if(selectedOptionFriends && user){
                    const playerData = await fetchGamePointsByGameIdFriends(selectedOptionFriends.id, user.id);
                    setPlayersGamePoints(playerData);

                    const playerData2 = await fetchGamePointsByGameIdFriends2(selectedOptionFriends.id, user.id);
                    setPlayersGamePoints2(playerData2);

                    const playerData3 = await fetchByPlayerAndGame(selectedOptionFriends.id, user.id);
                    setCurrentPlayer(playerData3);
                }
            } catch(error) {
                console.error("error fetching game points friends:", error);
            }
        }
        fetchGamePointsFriends();
    }, [selectedOptionFriends, user]);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGameId = event.target.value;
        const game = games?.find(g => g.id === selectedGameId);
        setSelectedOption(game || null);
    };
    const handleSelectChangeFriends = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGameId = event.target.value;
        const game = games?.find(g => g.id === selectedGameId);
        setSelectedOptionFriends(game || null);
        setCurrentPlayer(null);
    };

    return (
        <>
            <Header />
            <div className="suka">
                <div>
                    <h1>Leaderboards</h1>
                </div>
                <div className="leaderboards">
                    <div className="leaderboard">
                        <h4>Global leaderboard</h4>
                        {players ? (
                            players.map(player => (
                                <div key={player.id} className="leaderboard-card">
                                    <span>{player.nickname}</span>
                                    <span>{player.points}</span>
                                </div>
                            ))
                        ) : (
                            <p>Loading players...</p>
                        )}
                    </div>
                    <div className="leaderboard">
                        <h4>Friends leaderboard</h4>
                        {friendPlayers ? (
                            friendPlayers.map(friendPlayer => (
                                <div key={friendPlayer.id} className="leaderboard-card">
                                    <span>{friendPlayer.nickname}</span>
                                    <span>{friendPlayer.points}</span>
                                </div>
                            ))
                        ) : (
                            <p>Loading players...</p>
                        )}
                    </div>
                    <div className="leaderboard">
                        <h4>Global leaderboard by game</h4>
                        <select value={selectedOption?.id || ''} onChange={handleSelectChange} className="select-card">
                            {games ? (
                                games.map(game => (
                                    <option key={game.id} value={game.id}>{game.title}</option>
                                ))
                            ) : (
                                <option disabled>Loading games...</option>
                            )}
                        </select>
                        {gamePoints ? (
                            gamePoints.map(gamepoint => {
                                const player = players?.find(p => p.id === gamepoint.playerId);
                                return (
                                    <div key={gamepoint.id} className="leaderboard-card">
                                        <span>{player?.nickname}</span>
                                        <span>{gamepoint.points}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Loading players...</p>
                        )}
                    </div>
                    <div className="leaderboard">
                        <h4>Friends leaderboard by game</h4>
                        <select value={selectedOptionFriends?.id || ''} onChange={handleSelectChangeFriends} className="select-card">
                            {games ? (
                                games.map(game => (
                                    <option key={game.id} value={game.id}>{game.title}</option>
                                ))
                            ) : (
                                <option disabled>Loading games...</option>
                            )}
                        </select>
                        {friendPlayersPoints ? (
                            friendPlayersPoints.map(friendpoint => {
                                const player = players?.find(p => p.id === friendpoint.playerId);
                                return(
                                    <div key={friendpoint.id} className="leaderboard-card">
                                        <span>{player?.nickname}</span>
                                        <span>{friendpoint.points}</span>
                                    </div>
                                )
                            })
                        ) : (
                            <p>Loading players...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Leaderboard;
