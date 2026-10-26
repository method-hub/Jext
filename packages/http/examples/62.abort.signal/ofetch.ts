import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

export default async function run(): Promise<string> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const controller = new AbortController();
    // The user leaves the page: the server answers in 100 ms, the request is cancelled after 20
    setTimeout(() => controller.abort(), 20);

    try {
        await ofetch(`${API}/counter`, { query: { key }, signal: controller.signal });

        return 'finished';
    } catch (error) {
        // ofetch wraps the AbortError of fetch into a FetchError and keeps it in cause
        const cause = error instanceof FetchError ? (error as { cause?: Error }).cause : null;

        return cause?.name === 'AbortError' ? 'cancelled' : 'failed';
    }
}
