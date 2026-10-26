import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default async function run(): Promise<User[]> {
    const { data, error } = await http.get<User[]>(`${API}/users`);

    if (error) {
        throw error;
    }

    return data;
}
