import { FetchError, ofetch } from 'ofetch';
import * as v from 'valibot';
import { API } from '../api';

const User = v.object({
    id: v.number(),
    name: v.string(),
    email: v.pipe(v.string(), v.email()),
    role: v.picklist(['admin', 'editor', 'viewer']),
});

export default async function run(): Promise<v.InferOutput<typeof User>> {
    try {
        return v.parse(User, await ofetch<unknown>(`${API}/users/1`));
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
