import { FetchError, ofetch } from 'ofetch';
import { z } from 'zod';
import { API } from '../api';

// The server sends no age, so the data does not match
const User = z.object({ id: z.number(), name: z.string(), age: z.number() });

export default async function run(): Promise<string[]> {
    try {
        const result = User.safeParse(await ofetch<unknown>(`${API}/users/1`));

        return result.success ? [] : result.error.issues.map((issue) => issue.message);
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
