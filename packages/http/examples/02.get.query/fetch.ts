import { API } from '../api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default async function run(): Promise<User[]> {
    const query = new URLSearchParams({ role: 'admin', limit: String(10) });
    const response = await fetch(`${API}/users?${query.toString()}`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as User[];
}
