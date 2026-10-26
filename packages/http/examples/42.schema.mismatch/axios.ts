import axios from 'axios';
import { z } from 'zod';
import { API } from '../api';

// The server sends no age, so the data does not match
const User = z.object({ id: z.number(), name: z.string(), age: z.number() });

export default async function run(): Promise<string[]> {
    try {
        const { data } = await axios.get<unknown>(`${API}/users/1`);
        const result = User.safeParse(data);

        return result.success ? [] : result.error.issues.map((issue) => issue.message);
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
