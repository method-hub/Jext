import { API } from '../api';

interface User {
    id: number;
    name: string;
}
interface Seen {
    authorization: string | null;
}

async function api<T>(path: string): Promise<T> {
    const response = await fetch(`${API}${path}`, { headers: { Authorization: 'Bearer secret-token' } });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
}

export default async function run(): Promise<string[]> {
    const [me, seen] = await Promise.all([api<User>('/me'), api<Seen>('/echo/headers')]);

    return [me.name, seen.authorization ?? ''];
}
