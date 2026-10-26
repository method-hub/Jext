import { API } from '../api';

export default async function run(): Promise<boolean> {
    try {
        await fetch(`${API}/slow`, { signal: AbortSignal.timeout(200) });
        return false;
    } catch (error) {
        return (error as Error).name === 'TimeoutError';
    }
}
