import { z } from 'zod';
import { API } from '../api';

// The server sends no age, so the data does not match
const User = z.object({ id: z.number(), name: z.string(), age: z.number() });

export default async function run(): Promise<string[]> {
    const response = await fetch(`${API}/users/1`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = User.safeParse(await response.json());

    return result.success ? [] : result.error.issues.map((issue) => issue.message);
}
