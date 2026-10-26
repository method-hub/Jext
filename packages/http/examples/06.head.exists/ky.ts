import ky from 'ky';
import { API } from '../api';

async function exists(id: number): Promise<boolean> {
    const response = await ky.head(`${API}/users/${id}`, { throwHttpErrors: false });

    if (!response.ok && response.status !== 404) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.ok;
}

export default async function run(): Promise<boolean[]> {
    return [await exists(1), await exists(99)];
}
