import axios from "axios";
import { PlayerModel } from "../models/PlayerModel";
import { NewPasswordModel } from "../models/NewPasswordModel";

const baseUrl = `http://localhost:8080/players`;

export const updatePassword = async (id: string, password: NewPasswordModel): Promise<PlayerModel> => {

    const response = await axios.put(`${baseUrl}/change-password/${id}`, password);

    return response.data;
}
