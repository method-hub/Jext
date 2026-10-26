import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    try {
        await ofetch(`${API}/slow`, { timeout: 200, retry: 0 });
        return false;
    } catch (error) {
        return error instanceof FetchError && (error as { cause?: Error }).cause?.name === 'TimeoutError';
    }
}
