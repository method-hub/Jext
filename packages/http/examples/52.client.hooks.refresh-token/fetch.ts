import { API } from '../api';

interface User {
    id: number;
    name: string;
}

// The token kept from an earlier session; the server no longer accepts it
let token = 'expired-token';

async function refresh(): Promise<void> {
    const response = await fetch(`${API}/login`, {
        method: 'POST',
        body: new URLSearchParams({ username: 'alice', password: 'wonderland' }),
    });
    ({ token } = (await response.json()) as { token: string });
}

async function api<T>(path: string, retried = false): Promise<T> {
    const response = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });

    if (response.status === 401 && !retried) {
        await refresh();
        return api<T>(path, true);
    }

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
}

export default async function run(): Promise<string> {
    token = 'expired-token';
    const me = await api<User>('/me');

    return me.name;
}
