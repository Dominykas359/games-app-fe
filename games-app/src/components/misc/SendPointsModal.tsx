import { useEffect, useState } from "react";
import { PlayerModel } from "../../models/PlayerModel";
import { fetchPlayerByUsername, updatePlayer } from "../../api/PlayerApi";

interface Props {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    updatePlayerPoints: (newPoints: number) => void;  // New prop to update points in Header
}

function SendPointsModal({ isOpen, message, onConfirm, onCancel, updatePlayerPoints }: Props) {

    const [user, setUser] = useState<PlayerModel | null>(null);
    const [pointsToSend, setPointsToSend] = useState(0);
    const [pointsErrorMessage, setPointsErrorMessage] = useState<string | null>("");
    const [searchUsername, setSearchUsername] = useState<string>('');

    useEffect(() => {
        const initializeUser = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const data = JSON.parse(userData);
                setUser(data);
            }
        };

        initializeUser();
    }, []);

    const currentPoints = user?.points;

    const handlePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value)) {
            if(user && value > user.points){
                setPointsErrorMessage("You do not have that amount of points.");
            } else {
                setPointsErrorMessage(null);
            }
            setPointsToSend(value);
        }
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchUsername(event.target.value);
    };

    const handleCancel = () => {
        setPointsToSend(0);
        setPointsErrorMessage(null);
        onCancel();
    };

    const handleConfirm = async () => {
        if(pointsToSend === 0){
            setPointsErrorMessage("Can not send 0 points.");
        }
        try{
            const sentTo: PlayerModel = await fetchPlayerByUsername(searchUsername);
            if(user){
                if(pointsToSend <= user.points){
                    user.points -= pointsToSend;
                    localStorage.setItem("user", JSON.stringify(user));
                    await updatePlayer(user.id, user);
                    
                    // Update the points in the Header via prop
                    updatePlayerPoints(user.points);
                }
                else{
                    setPointsErrorMessage("You do not have that amount of points.");
                }
            }
            if(sentTo && user){
                if(pointsToSend <= user?.points){
                    sentTo.points += pointsToSend;
                    await updatePlayer(sentTo.id, sentTo);
                }
                else{
                    setPointsErrorMessage("You do not have that amount of points.");
                }
            }

        }catch{
            setPointsErrorMessage("Player not found.");
        }
        if (!pointsErrorMessage) {
            onConfirm();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="send-points-modal">
            <div className="send-points-modal-content">
                <h2>{message}</h2>
                <input type="text"
                    placeholder="Send to..."
                    className="send-points-to" 
                    onChange={handleSearchInputChange}
                />
                <input 
                    type="number" 
                    min={1} 
                    max={currentPoints} 
                    value={pointsToSend} 
                    className="how-many-points" 
                    onChange={handlePointsChange} 
                />
                {pointsErrorMessage && (
                    <div className="error-message">{pointsErrorMessage}</div>
                )}
                <br></br>
                <button onClick={handleConfirm} className="points-send">Send</button>
                <button onClick={handleCancel} className="points-cancel">Cancel</button>
            </div>
        </div>
    );
}

export default SendPointsModal;
