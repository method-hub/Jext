import axios from 'axios';
import { API } from '../api';

interface Upload {
    file: { name: string; size: number; type: string };
}

export default async function run(): Promise<Upload> {
    try {
        const form = new FormData();
        form.append('file', new Blob(['Hello, jext!'], { type: 'text/plain' }), 'hello.txt');
        const { data } = await axios.post<Upload>(`${API}/files`, form);

        return data;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
