import { API } from '../api';

interface Outcome {
    attempt: number;
    seconds: number;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAfterBusy(url: string): Promise<Response> {
    const response = await fetch(url);

    if (response.status !== 429) {
        return response;
    }

    // Retry-After holds seconds or an HTTP date; this server sends seconds
    await sleep(Number(response.headers.get('Retry-After') ?? 1) * 1000);

    return fetch(url);
}

export default async function run(): Promise<Outcome> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const started = Date.now();

    const response = await getAfterBusy(`${API}/busy?key=${key}`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const { attempt } = (await response.json()) as { attempt: number };

    return { attempt, seconds: Math.round((Date.now() - started) / 1000) };
}
