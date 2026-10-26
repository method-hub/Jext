import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}

const api = http.extend({ baseUrl: API });

async function user(id: number): Promise<string> {
    const { data, error } = await api.get<User>(`/users/${id}`);

    if (error) {
        throw error;
    }

    return data.name;
}

export default async function run(): Promise<string[]> {
    return Promise.all([user(1), user(2)]);
}
