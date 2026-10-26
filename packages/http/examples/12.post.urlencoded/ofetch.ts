import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Login {
    token: string;
}

export default async function run(): Promise<Login> {
    try {
        const credentials = new URLSearchParams({ username: 'alice', password: 'wonderland' });

        return await ofetch<Login>(`${API}/login`, { method: 'POST', body: credentials });
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
