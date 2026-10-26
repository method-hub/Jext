import { API } from '../api';

interface User {
    id: number;
    name: string;
}

async function api<T>(path: string): Promise<T> {
    const response = await fetch(`${API}${path}`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
}

export default async function run(): Promise<string[]> {
    const users = await Promise.all([api<User>('/users/1'), api<User>('/users/2')]);

    return users.map((user) => user.name);
}
