import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default async function run(): Promise<User> {
    const user = { name: 'Eve Laurent', email: 'eve@example.com', role: 'editor' };
    const { data, error } = await http.post<User>(`${API}/users`).body(user);

    if (error) {
        throw error;
    }

    return data;
}
