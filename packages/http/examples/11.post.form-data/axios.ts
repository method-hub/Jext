import axios from 'axios';
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
        const { data } = await axios.post<Feedback>(`${API}/feedback`, form);

        return data;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
