import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Settings {
    theme: string;
    language: string;
}

export default async function run(): Promise<Settings> {
    try {
        return await ofetch<Settings>(`${API}/settings`, { responseType: 'json' });
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
