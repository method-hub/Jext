import ky from 'ky';
import { API } from '../api';

export default async function run(): Promise<string> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const controller = new AbortController();
    // The user leaves the page: the server answers in 100 ms, the request is cancelled after 20
    setTimeout(() => controller.abort(), 20);

    try {
        await ky.get(`${API}/counter`, { searchParams: { key }, signal: controller.signal });

        return 'finished';
    } catch (error) {
        // ky rethrows the AbortError of fetch as it is
        return (error as Error).name === 'AbortError' ? 'cancelled' : 'failed';
    }
}
