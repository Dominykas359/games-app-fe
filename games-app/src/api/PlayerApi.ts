import axios from "axios";
import { PlayerModel } from "../models/PlayerModel";

const baseUrl = `http://localhost:8080/players`;

export const fetchPlayerById = async (id: string): Promise<PlayerModel> => {
    
    const response = await axios.get<PlayerModel>(`${baseUrl}/${id}`);
  
    return response.data;
  };