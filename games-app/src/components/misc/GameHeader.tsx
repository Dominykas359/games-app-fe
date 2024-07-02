import './styles/ProfilePicture.css';
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../types/routes";

interface GameHeaderProps {
    points: number;
}

function GameHeader({ points }: GameHeaderProps) {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        // Update localStorage 'user' with new points
        const data = localStorage.getItem('user');
        if (data) {
            const user = JSON.parse(data);
            user.points = points; // Update points in localStorage
            localStorage.setItem('user', JSON.stringify(user));
        }

        // Navigate to game list
        navigate(AppRoutes.GAMES);
    }

    return (
        <>
            <div className="parent-header-game">
                <div className="show-points-game">
                    <span>Points: {points}</span>
                </div>
                <div>
                    <button className="back-button" onClick={handleButtonClick}>To games list</button>
                </div>
            </div>
            <hr></hr>
        </>
    );
}

export default GameHeader;
