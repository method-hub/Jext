import { http } from '@metapraxis/jext-http';
import { z } from 'zod';
import { API } from '../api';

const User = z.object({
    id: z.number(),
    name: z.string(),
    email: z.email(),
    role: z.enum(['admin', 'editor', 'viewer']),
});

export default async function run(): Promise<z.infer<typeof User>> {
    const { data, error } = await http.get(`${API}/users/1`).schema(User);

    if (error) {
        throw error;
    }

    return data;
}
