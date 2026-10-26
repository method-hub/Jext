import { http } from '@metapraxis/jext-http';
import { API } from '../api';

async function exists(id: number): Promise<boolean> {
    const { error } = await http.head(`${API}/users/${id}`);

    if (error && error.status !== 404) {
        throw error;
    }

    return !error;
}

export default async function run(): Promise<boolean[]> {
    return [await exists(1), await exists(99)];
}
