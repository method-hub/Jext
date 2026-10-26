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
        const user = { name: 'Bob Tanaka', email: 'bob.tanaka@example.com', role: 'admin' };

        return await ky.put(`${API}/users/2`, { json: user }).json<User>();
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
