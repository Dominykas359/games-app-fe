import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ProfilePicture.css';

function ProfileButton() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLogout = () => {
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
