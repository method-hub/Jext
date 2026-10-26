import { API } from '../api';

interface Counter {
    hits: number;
}

// The requests in flight by URL: a second call for the same URL gets the promise of the first one
const inflight = new Map<string, Promise<Counter>>();

function once(url: string, request: (target: string) => Promise<Counter>): Promise<Counter> {
    const pending = inflight.get(url) ?? request(url).finally(() => inflight.delete(url));
    inflight.set(url, pending);

    return pending;
}

async function load(url: string): Promise<Counter> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as Counter;
}

export default async function run(): Promise<number[]> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const url = `${API}/counter?key=${key}`;

    const counters = await Promise.all([1, 2, 3].map(() => once(url, load)));

    return counters.map(({ hits }) => hits);
}
