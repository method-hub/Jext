import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Seen {
    app: string | null;
    authorization: string | null;
}

const api = http.extend({ baseUrl: API, headers: { 'X-App': 'lessons' } });
const admin = api.extend({ headers: { Authorization: 'Bearer secret-token' } });

export default async function run(): Promise<Seen> {
    const { data, error } = await admin.get<Seen>('/echo/headers');

    if (error) {
        throw error;
    }

    return data;
}
