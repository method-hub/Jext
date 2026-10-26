import { API } from '../api';

interface Login {
    token: string;
}

export default async function run(): Promise<Login> {
    const credentials = new URLSearchParams({ username: 'alice', password: 'wonderland' });
    const response = await fetch(`${API}/login`, { method: 'POST', body: credentials });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as Login;
}
