import ky, { HTTPError } from 'ky';
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
        return await ky.get(`${API}/users/1`).json(User);
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
