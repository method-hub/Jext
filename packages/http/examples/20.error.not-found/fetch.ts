import { API } from '../api';

interface Problem {
    status: number;
    message: string;
}

export default async function run(): Promise<Problem> {
    const response = await fetch(`${API}/users/42`);

    if (response.ok) {
        throw new Error('User 42 should not exist');
    }

    const body = (await response.json()) as { message: string };

    return { status: response.status, message: body.message };
}
