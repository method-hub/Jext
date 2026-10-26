import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Login {
    token: string;
}

export default async function run(): Promise<Login> {
    const credentials = new URLSearchParams({ username: 'alice', password: 'wonderland' });
    const { data, error } = await http.post<Login>(`${API}/login`).body(credentials);

    if (error) {
        throw error;
    }

    return data;
}
