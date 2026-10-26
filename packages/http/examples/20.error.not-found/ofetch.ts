import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Problem {
    status: number;
    message: string;
}

export default async function run(): Promise<Problem> {
    try {
        await ofetch(`${API}/users/42`);
    } catch (error) {
        if (error instanceof FetchError && error.response) {
            const body = error.data as { message: string };
            return { status: error.response.status, message: body.message };
        }
        throw error;
    }

    throw new Error('User 42 should not exist');
}
