import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface Upload {
    file: { name: string; size: number; type: string };
}

export default async function run(): Promise<Upload> {
    try {
        const form = new FormData();
        form.append('file', new Blob(['Hello, jext!'], { type: 'text/plain' }), 'hello.txt');

        return await ky.post(`${API}/files`, { body: form }).json<Upload>();
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
