import * as v from 'valibot';
import { API } from '../api';

const User = v.object({
    id: v.number(),
    name: v.string(),
    email: v.pipe(v.string(), v.email()),
    role: v.picklist(['admin', 'editor', 'viewer']),
});

export default async function run(): Promise<v.InferOutput<typeof User>> {
    const response = await fetch(`${API}/users/1`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return v.parse(User, await response.json());
}
