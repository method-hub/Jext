import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface Login {
    token: string;
}

export default async function run(): Promise<Login> {
    try {
        const credentials = new URLSearchParams({ username: 'alice', password: 'wonderland' });

        return await ky.post(`${API}/login`, { body: credentials }).json<Login>();
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
