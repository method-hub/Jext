import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default async function run(): Promise<User> {
    const user = { role: 'admin' };
    const { data, error } = await http.patch<User>(`${API}/users/2`).body(user);

    if (error) {
        throw error;
    }

    return data;
}
