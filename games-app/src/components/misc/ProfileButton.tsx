import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ProfilePicture.css';
import { PlayerModel } from '../../models/PlayerModel';
import { updatePlayer } from '../../api/PlayerApi';

function ProfileButton() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLogout = async () => {
        const data = localStorage.getItem('user');
        
        if (data) {
            const user: PlayerModel = JSON.parse(data);
            user.lastOnline = new Date();
            
            try {
                await updatePlayer(user.id, user);
            } catch (error) {
                console.error('Error updating lastOnline:', error);
            }
        }
        
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="profile-picture">
            <div className="profile-picture" onClick={toggleDropdown}>
                <img src="profile.png" className="image" alt="Profile" />
            </div>
            {dropdownVisible && (
                <div className="dropdown">
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}

export default ProfileButton;
