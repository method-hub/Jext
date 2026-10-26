import axios from 'axios';
import { z } from 'zod';
import { API } from '../api';

const User = z.object({
    id: z.number(),
    name: z.string(),
    email: z.email(),
    role: z.enum(['admin', 'editor', 'viewer']),
});

export default async function run(): Promise<z.infer<typeof User>> {
    try {
        const { data } = await axios.get<unknown>(`${API}/users/1`);

        return User.parse(data);
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
