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

function load(url: string): Promise<Counter> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
                return;
            }

            resolve(xhr.response as Counter);
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}

export default async function run(): Promise<number[]> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const url = `${API}/counter?key=${key}`;

    const counters = await Promise.all([1, 2, 3].map(() => once(url, load)));

    return counters.map(({ hits }) => hits);
}
