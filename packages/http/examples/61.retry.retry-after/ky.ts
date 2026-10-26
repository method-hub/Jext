import ky, { HTTPError } from 'ky';
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

        // ky reads Retry-After of a 413, 429 or 503 by itself
        const { attempt } = await ky
            .get(`${API}/busy`, { searchParams: { key }, retry: 1 })
            .json<{ attempt: number }>();

        return { attempt, seconds: Math.round((Date.now() - started) / 1000) };
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
