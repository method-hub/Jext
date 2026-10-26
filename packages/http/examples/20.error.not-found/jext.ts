import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Problem {
    status: number;
    message: string;
}

export default async function run(): Promise<Problem> {
    const { error } = await http.get<unknown, { message: string }>(`${API}/users/42`);

    if (!error) {
        throw new Error('User 42 should not exist');
    }

    return { status: error.status, message: error.data?.message ?? error.message };
}
