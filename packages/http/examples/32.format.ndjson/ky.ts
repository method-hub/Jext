import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface Activity {
    type: string;
    user: number;
}

export default async function run(): Promise<Activity[]> {
    try {
        const text = await ky.get(`${API}/events.ndjson`).text();

        return text
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => JSON.parse(line) as Activity);
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
