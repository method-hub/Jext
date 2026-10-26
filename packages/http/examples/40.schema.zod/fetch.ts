import { z } from 'zod';
import { API } from '../api';

const User = z.object({
    id: z.number(),
    name: z.string(),
    email: z.email(),
    role: z.enum(['admin', 'editor', 'viewer']),
});

export default async function run(): Promise<z.infer<typeof User>> {
    const response = await fetch(`${API}/users/1`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return User.parse(await response.json());
}
