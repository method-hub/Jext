import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default async function run(): Promise<User> {
    try {
        const user = { name: 'Eve Laurent', email: 'eve@example.com', role: 'editor' };

        return await ky.post(`${API}/users`, { json: user }).json<User>();
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
