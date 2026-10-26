import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}
interface Seen {
    authorization: string | null;
}

const api = ofetch.create({ baseURL: API, headers: { Authorization: 'Bearer secret-token' } });

export default async function run(): Promise<string[]> {
    try {
        const [me, seen] = await Promise.all([api<User>('/me'), api<Seen>('/echo/headers')]);

        return [me.name, seen.authorization ?? ''];
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
