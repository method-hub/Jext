import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<string> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const controller = new AbortController();
    // The user leaves the page: the server answers in 100 ms, the request is cancelled after 20
    setTimeout(() => controller.abort(), 20);

    const { error } = await http.get(`${API}/counter`).query({ key }).signal(controller.signal);

    // An abort is a request without a response: status 0, the AbortError in cause
    return (error?.cause as Error | undefined)?.name === 'AbortError' ? 'cancelled' : 'finished';
}
