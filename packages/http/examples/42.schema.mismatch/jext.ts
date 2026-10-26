import { http, ValidationError } from '@metapraxis/jext-http';
import { z } from 'zod';
import { API } from '../api';

// The server sends no age, so the data does not match
const User = z.object({ id: z.number(), name: z.string(), age: z.number() });

export default async function run(): Promise<string[]> {
    const { error } = await http.get(`${API}/users/1`).schema(User);

    if (error instanceof ValidationError) {
        return error.issues.map((issue) => issue.message);
    }

    if (error) {
        throw error;
    }

    return [];
}
