import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}
interface Seen {
    authorization: string | null;
}

const api = http.extend({ baseUrl: API, headers: { Authorization: 'Bearer secret-token' } });

export default async function run(): Promise<string[]> {
    const [me, seen] = await Promise.all([api.get<User>('/me'), api.get<Seen>('/echo/headers')]);

    if (me.error ?? seen.error) {
        throw me.error ?? seen.error;
    }

    return [me.data.name, seen.data.authorization ?? ''];
}
