import axios from 'axios';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}

const api = axios.create({ baseURL: API });

export default async function run(): Promise<string[]> {
    try {
        const responses = await Promise.all([api.get<User>('/users/1'), api.get<User>('/users/2')]);

        return responses.map(({ data }) => data.name);
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
