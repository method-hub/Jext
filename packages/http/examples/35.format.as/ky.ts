import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface Settings {
    theme: string;
    language: string;
}

export default async function run(): Promise<Settings> {
    try {
        return await ky.get(`${API}/settings`).json<Settings>();
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
