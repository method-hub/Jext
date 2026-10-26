import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Upload {
    file: { name: string; size: number; type: string };
}

export default async function run(): Promise<Upload> {
    const form = new FormData();
    form.append('file', new Blob(['Hello, jext!'], { type: 'text/plain' }), 'hello.txt');
    const { data, error } = await http.post<Upload>(`${API}/files`).body(form);

    if (error) {
        throw error;
    }

    return data;
}
