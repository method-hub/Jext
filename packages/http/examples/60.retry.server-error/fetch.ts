import { API } from '../api';

// The statuses worth repeating: the server is busy or briefly down
const RETRYABLE = [408, 429, 500, 502, 503, 504];

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWithRetry(url: string, retries: number, delay: number): Promise<Response> {
    const response = await fetch(url);

    if (response.ok || retries === 0 || !RETRYABLE.includes(response.status)) {
        return response;
    }

    await sleep(delay);

    return getWithRetry(url, retries - 1, delay * 2);
}

export default async function run(): Promise<number> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);

    const response = await getWithRetry(`${API}/flaky?key=${key}`, 2, 100);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return ((await response.json()) as { attempt: number }).attempt;
}
