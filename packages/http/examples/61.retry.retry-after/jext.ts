import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Outcome {
    attempt: number;
    seconds: number;
}

export default async function run(): Promise<Outcome> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const started = Date.now();

    // Retry-After of the 429 replaces the delay of the retry
    const { data, error } = await http.get<{ attempt: number }>(`${API}/busy`).query({ key }).retry(1);

    if (error) {
        throw error;
    }

    return { attempt: data.attempt, seconds: Math.round((Date.now() - started) / 1000) };
}
