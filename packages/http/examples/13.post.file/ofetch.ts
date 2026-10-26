import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Upload {
    file: { name: string; size: number; type: string };
}

export default async function run(): Promise<Upload> {
    try {
        const form = new FormData();
        form.append('file', new Blob(['Hello, jext!'], { type: 'text/plain' }), 'hello.txt');

        return await ofetch<Upload>(`${API}/files`, { method: 'POST', body: form });
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
