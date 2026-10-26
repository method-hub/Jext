import { API } from '../api';

export default async function run(): Promise<boolean> {
    const response = await fetch(`${API}/users/4`, { method: 'DELETE' });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return true;
}
