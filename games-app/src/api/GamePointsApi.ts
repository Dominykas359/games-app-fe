import axios from "axios";
import { GamePointsModel } from "../models/GamePointsModel";

const baseUrl = "http://localhost:8080/points"

export const createGamePoints = async (body: GamePointsModel): Promise<GamePointsModel> => {

    const response = await axios.post<GamePointsModel>(`${baseUrl}`, body);

    return response.data;
}
 
export const fetchGamePointsByGameId = async (id: string): Promise<GamePointsModel[]> => {

    const response = await axios.get<GamePointsModel[]>(`${baseUrl}/game/${id}`);

    return response.data;
}

export const fetchGamePointsByGameIdFriends = async (id: string, playerId: string): Promise<GamePointsModel[]> => {

    const response = await axios.get<GamePointsModel[]>(`${baseUrl}/leaderboard/${id}/player/${playerId}`);

    return response.data;
}

export const fetchGamePointsByGameIdFriends2 = async (id: string, playerId: string): Promise<GamePointsModel[]> => {

    const response = await axios.get<GamePointsModel[]>(`${baseUrl}/leaderboard2/${id}/player/${playerId}`);

    return response.data;
}

export const fetchByPlayerAndGame = async (id: string, playerId: string): Promise<GamePointsModel> => {

    const response = await axios.get<GamePointsModel>(`${baseUrl}/player/${playerId}/game/${id}`);

    return response.data;
}
