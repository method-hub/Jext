import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}

const api = ofetch.create({ baseURL: API });

export default async function run(): Promise<string[]> {
    try {
        const users = await Promise.all([api<User>('/users/1'), api<User>('/users/2')]);

        return users.map((user) => user.name);
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
