import ky, { HTTPError } from 'ky';
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

        return await ky.post(`${API}/feedback`, { body: form }).json<Feedback>();
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
