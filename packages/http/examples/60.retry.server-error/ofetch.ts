import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

export default async function run(): Promise<number> {
    try {
        // A new key makes the server count the attempts of this run from one
        const key = Math.random().toString(36).slice(2);

        const { attempt } = await ofetch<{ attempt: number }>(`${API}/flaky`, {
            query: { key },
            retry: 2,
            retryDelay: 100,
        });

        return attempt;
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
