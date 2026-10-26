import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Feedback {
    name: string;
    message: string;
}

export default async function run(): Promise<Feedback> {
    const form = new FormData();
    form.append('name', 'Eve Laurent');
    form.append('message', 'The lessons helped a lot!');
    const { data, error } = await http.post<Feedback>(`${API}/feedback`).body(form);

    if (error) {
        throw error;
    }

    return data;
}
