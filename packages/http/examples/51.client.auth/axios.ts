import axios from 'axios';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}
interface Seen {
    authorization: string | null;
}

const api = axios.create({ baseURL: API, headers: { Authorization: 'Bearer secret-token' } });

export default async function run(): Promise<string[]> {
    try {
        const [me, seen] = await Promise.all([api.get<User>('/me'), api.get<Seen>('/echo/headers')]);

        return [me.data.name, seen.data.authorization ?? ''];
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
