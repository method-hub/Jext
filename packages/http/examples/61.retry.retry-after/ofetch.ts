import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Outcome {
    attempt: number;
    seconds: number;
}

export default async function run(): Promise<Outcome> {
    try {
        // A new key makes the server count the attempts of this run from one
        const key = Math.random().toString(36).slice(2);
        const started = Date.now();

        // ofetch retries a 429 but ignores Retry-After, so retryDelay reads it from the response
        const { attempt } = await ofetch<{ attempt: number }>(`${API}/busy`, {
            query: { key },
            retry: 1,
            retryDelay: ({ response }) => Number(response?.headers.get('Retry-After') ?? 1) * 1000,
        });

        return { attempt, seconds: Math.round((Date.now() - started) / 1000) };
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
