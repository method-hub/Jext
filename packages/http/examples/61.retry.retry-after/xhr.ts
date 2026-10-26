import { API } from '../api';

interface Outcome {
    attempt: number;
    seconds: number;
}

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

async function getAfterBusy(url: string): Promise<XMLHttpRequest> {
    const xhr = await send(url);

    if (xhr.status !== 429) {
        return xhr;
    }

    // Retry-After holds seconds or an HTTP date; this server sends seconds
    await sleep(Number(xhr.getResponseHeader('Retry-After') ?? 1) * 1000);

    return send(url);
}

export default async function run(): Promise<Outcome> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const started = Date.now();

    const xhr = await getAfterBusy(`${API}/busy?key=${key}`);

    if (xhr.status < 200 || xhr.status >= 300) {
        throw new Error(`${xhr.status} ${xhr.statusText}`);
    }

    const { attempt } = xhr.response as { attempt: number };

    return { attempt, seconds: Math.round((Date.now() - started) / 1000) };
}
