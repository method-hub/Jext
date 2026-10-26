import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Feedback {
    name: string;
    message: string;
}

export default async function run(): Promise<Feedback> {
    try {
        const form = new FormData();
        form.append('name', 'Eve Laurent');
        form.append('message', 'The lessons helped a lot!');

        return await ofetch<Feedback>(`${API}/feedback`, { method: 'POST', body: form });
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
