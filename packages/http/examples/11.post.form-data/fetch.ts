import { API } from '../api';

interface Feedback {
    name: string;
    message: string;
}

export default async function run(): Promise<Feedback> {
    const form = new FormData();
    form.append('name', 'Eve Laurent');
    form.append('message', 'The lessons helped a lot!');
    const response = await fetch(`${API}/feedback`, { method: 'POST', body: form });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as Feedback;
}
