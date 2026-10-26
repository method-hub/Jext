import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Counter {
    hits: number;
}

export default async function run(): Promise<number[]> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    // Identical GET requests sent while the first is in flight share its response
    const requests = [1, 2, 3].map(() => http.get<Counter>(`${API}/counter`).query({ key }).dedupe());

    const results = await Promise.all(requests);
    const failed = results.find(({ error }) => error);

    if (failed?.error) {
        throw failed.error;
    }

    return results.map(({ data }) => data.hits);
}
