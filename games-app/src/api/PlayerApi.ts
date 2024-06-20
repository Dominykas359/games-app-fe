import axios from "axios";
import { PlayerModel } from "../models/PlayerModel";

const baseUrl = `http://localhost:8080/players`;

export const fetchPlayerById = async (id: string): Promise<PlayerModel> => {
    
  const response = await axios.get<PlayerModel>(`${baseUrl}/${id}`);

  return response.data;
};

export const fetchPlayerByUsername = async (username: string): Promise<PlayerModel> => {

  const response = await axios.get<PlayerModel>(`${baseUrl}/username/${username}`);

  return response.data;
}

export const updatePlayer = async (id: string, player: PlayerModel): Promise<PlayerModel> => {

  const response = await axios.put<PlayerModel>(`${baseUrl}/${id}`, player);

  return response.data;
}