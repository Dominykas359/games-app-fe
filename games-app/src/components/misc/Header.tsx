import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./styles/ProfilePicture.css";
import { AppRoutes } from "../../types/routes";
import { PlayerModel } from "../../models/PlayerModel";
import { fetchPlayerById } from "../../api/PlayerApi";

function Header() {
    const [player, setPlayer] = useState<PlayerModel | null>(null);
    const [error, setError] = useState<string | null>(null);

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
                    setError('Failed to fetch player data.');
                });
        } else {
            console.error('No valid ID found in localStorage.');
            setError('No valid ID found in localStorage.');
        }
    }, []);

    return (
        <>
            <div className="parent-header">
                <Link to={AppRoutes.GAMES} className="nav-link">
                    <img src="/icon.png" className="button-icon" alt="Games"></img>
                </Link>
                <Link to={AppRoutes.FRIENDS} className="nav-link">
                    <img src="/friends.png" className="button-icon" alt="Friends"></img>
                </Link>
                <Link to={AppRoutes.LEADERBOARD} className="nav-link">
                    <img src="/leaderboard.png" className="button-icon" alt="Leaderboard"></img>
                </Link>
                <Link to={AppRoutes.SETTINGS} className="nav-link">
                    <img src="/settings.png" className="button-icon" alt="Settings"></img>
                </Link>
                
                <div className="show-points">
                    <span>Points: {player ? player.points : 'Loading...'}</span>
                </div>
                <ProfileButton />
            </div>
            <hr></hr>
            {error && <div className="error-message">{error}</div>}
        </>
    );
}

export default Header;
