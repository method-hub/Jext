import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<number> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);

    const { data, error } = await http
        .get<{ attempt: number }>(`${API}/flaky`)
        .query({ key })
        .retry({ limit: 2, delay: 100 });

    if (error) {
        throw error;
    }

    return data.attempt;
}
