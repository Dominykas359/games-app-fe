import axios from "axios";
import { GameModel } from "../models/GameModel";

const baseUrl = `http://localhost:8080/games`;

export const fetchAllGames = async (): Promise<GameModel[]> => {

    const response = await axios.get<GameModel[]>(`${baseUrl}`);

    return response.data;
}

export const fetchGameById = async (id: string): Promise<GameModel> => {

    const response = await axios.get<GameModel>(`${baseUrl}/${id}`);

    return response.data;
}