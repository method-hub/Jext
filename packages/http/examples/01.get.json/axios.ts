import axios from 'axios';
import { API } from '../api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default async function run(): Promise<User[]> {
    try {
        const { data } = await axios.get<User[]>(`${API}/users`);

        return data;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
