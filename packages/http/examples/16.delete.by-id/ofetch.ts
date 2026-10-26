import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    try {
        await ofetch(`${API}/users/4`, { method: 'DELETE' });

        return true;
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
