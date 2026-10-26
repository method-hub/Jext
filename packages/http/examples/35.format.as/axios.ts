import axios from 'axios';
import { API } from '../api';

interface Settings {
    theme: string;
    language: string;
}

export default async function run(): Promise<Settings> {
    try {
        const { data } = await axios.get<Settings>(`${API}/settings`);

        return data;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
