import { API } from '../api';

// The statuses worth repeating: the server is busy or briefly down
const RETRYABLE = [408, 429, 500, 502, 503, 504];

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function send(url: string): Promise<XMLHttpRequest> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onload = () => resolve(xhr);
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}

async function getWithRetry(url: string, retries: number, delay: number): Promise<XMLHttpRequest> {
    const xhr = await send(url);

    if ((xhr.status >= 200 && xhr.status < 300) || retries === 0 || !RETRYABLE.includes(xhr.status)) {
        return xhr;
    }

    await sleep(delay);

    return getWithRetry(url, retries - 1, delay * 2);
}

export default async function run(): Promise<number> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);

    const xhr = await getWithRetry(`${API}/flaky?key=${key}`, 2, 100);

    if (xhr.status < 200 || xhr.status >= 300) {
        throw new Error(`${xhr.status} ${xhr.statusText}`);
    }

    return (xhr.response as { attempt: number }).attempt;
}
