import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Activity {
    type: string;
    user: number;
}

export default async function run(): Promise<Activity[]> {
    try {
        const text = await ofetch(`${API}/events.ndjson`, { responseType: 'text' });

        return text
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => JSON.parse(line) as Activity);
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
