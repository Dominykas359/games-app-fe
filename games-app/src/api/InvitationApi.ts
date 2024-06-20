import axios from "axios";
import { InvitationModel } from "../models/InvitationModel";

const baseUrl = `http://localhost:8080/invitations`;

export const fetchInvitationsByPlayer = async (id: string): Promise<InvitationModel[]> => {

    const response = await axios.get<InvitationModel[]>(`${baseUrl}/list/${id}`);

    return response.data;
}

export const fetchInvitationsByFriend = async (id: string): Promise<InvitationModel[]> => {

    const response = await axios.get<InvitationModel[]>(`${baseUrl}/list/friend/${id}`)

    return response.data;
}

export const deleteInvitation = async (id: string): Promise<InvitationModel> => {

    const response = await axios.delete<InvitationModel>(`${baseUrl}/${id}`);

    return response.data;
}

export const createInvitation = async (invitation: InvitationModel): Promise<InvitationModel> => {

    const response = await axios.post<InvitationModel>(`${baseUrl}`, invitation);

    return response.data;
}