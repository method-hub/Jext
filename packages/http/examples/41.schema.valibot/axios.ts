import axios from 'axios';
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
        const { data } = await axios.get<unknown>(`${API}/users/1`);

        return v.parse(User, data);
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
