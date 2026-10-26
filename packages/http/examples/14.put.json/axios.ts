import axios from 'axios';
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
        const { data } = await axios.put<User>(`${API}/users/2`, user);

        return data;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
