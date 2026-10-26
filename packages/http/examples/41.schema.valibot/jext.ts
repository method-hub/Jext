import { http } from '@metapraxis/jext-http';
import * as v from 'valibot';
import { API } from '../api';

const User = v.object({
    id: v.number(),
    name: v.string(),
    email: v.pipe(v.string(), v.email()),
    role: v.picklist(['admin', 'editor', 'viewer']),
});

export default async function run(): Promise<v.InferOutput<typeof User>> {
    const { data, error } = await http.get(`${API}/users/1`).schema(User);

    if (error) {
        throw error;
    }

    return data;
}
