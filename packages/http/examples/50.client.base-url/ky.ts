import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}

const api = ky.create({ baseUrl: API });

export default async function run(): Promise<string[]> {
    try {
        const users = await Promise.all([api.get('/users/1').json<User>(), api.get('/users/2').json<User>()]);

        return users.map((user) => user.name);
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
