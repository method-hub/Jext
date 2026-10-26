import { FetchError, ofetch } from 'ofetch';
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
        return User.parse(await ofetch<unknown>(`${API}/users/1`));
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
