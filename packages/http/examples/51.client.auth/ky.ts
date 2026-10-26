import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}
interface Seen {
    authorization: string | null;
}

const api = ky.create({ baseUrl: API, headers: { Authorization: 'Bearer secret-token' } });

export default async function run(): Promise<string[]> {
    try {
        const [me, seen] = await Promise.all([api.get('/me').json<User>(), api.get('/echo/headers').json<Seen>()]);

        return [me.name, seen.authorization ?? ''];
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
