import { useEffect, useState } from "react";
import { fetchPlayerById } from "../../../api/PlayerApi";
import { PlayerModel } from "../../../models/PlayerModel";
import GameHeader from "../../misc/GameHeader";
import "./styles/Roullete.css";

function Roullete(){

    const [player, setPlayer] = useState<PlayerModel | null>(null);

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

    return(
        <>
            <GameHeader points={player?.points || 0} />
            <div className="roullete-container">
                <h1>Roullete</h1>
                <h3>Coming soon...</h3>
            </div>
        </>
    );
}

export default Roullete;