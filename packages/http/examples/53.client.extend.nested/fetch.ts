import { API } from '../api';

interface Seen {
    app: string | null;
    authorization: string | null;
}

function client(headers: Record<string, string>) {
    return async <T>(path: string): Promise<T> => {
        const response = await fetch(`${API}${path}`, { headers });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        return (await response.json()) as T;
    };
}

const base = { 'X-App': 'lessons' };
const admin = client({ ...base, Authorization: 'Bearer secret-token' });

export default async function run(): Promise<Seen> {
    return admin<Seen>('/echo/headers');
}
