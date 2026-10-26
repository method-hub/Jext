import axios from 'axios';
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
    const { data } = await axios.get<Counter>(url);

    return data;
}

export default async function run(): Promise<number[]> {
    try {
        // A new key makes the server count the attempts of this run from one
        const key = Math.random().toString(36).slice(2);
        const url = `${API}/counter?key=${key}`;

        const counters = await Promise.all([1, 2, 3].map(() => once(url, load)));

        return counters.map(({ hits }) => hits);
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
