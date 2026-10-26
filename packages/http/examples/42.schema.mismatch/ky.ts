import ky, { SchemaValidationError } from 'ky';
import { z } from 'zod';
import { API } from '../api';

// The server sends no age, so the data does not match
const User = z.object({ id: z.number(), name: z.string(), age: z.number() });

export default async function run(): Promise<string[]> {
    try {
        await ky.get(`${API}/users/1`).json(User);
        return [];
    } catch (error) {
        if (error instanceof SchemaValidationError) {
            return error.issues.map((issue) => issue.message);
        }
        throw error;
    }
}
