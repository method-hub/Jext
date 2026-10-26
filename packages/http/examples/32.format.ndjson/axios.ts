import axios from 'axios';
import { API } from '../api';

interface Activity {
    type: string;
    user: number;
}

export default async function run(): Promise<Activity[]> {
    try {
        const { data: text } = await axios.get<string>(`${API}/events.ndjson`, { responseType: 'text' });

        return text
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => JSON.parse(line) as Activity);
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
