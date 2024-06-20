import axios from "axios";
import { FriendModel } from "../models/FriendModel";

const baseUrl = `http://localhost:8080/friends`;

export const fetchFriendsByPlayer = async (id: string): Promise<FriendModel[]> => {

    const response = await axios.get<FriendModel[]>(`${baseUrl}/list/${id}`);

    return response.data;
}

export const fetchFriendsByFriend = async (id: string): Promise<FriendModel[]> => {

    const response = await axios.get<FriendModel[]>(`${baseUrl}/list/friend/${id}`)

    return response.data;
}

export const deleteFriend = async (id: string): Promise<FriendModel> => {

    const response = await axios.delete<FriendModel>(`${baseUrl}/${id}`);

    return response.data;
}

export const createFriend = async (friend: FriendModel): Promise<FriendModel> => {
    
    const response = await axios.post<FriendModel>(`${baseUrl}`, friend);

    return response.data;
}