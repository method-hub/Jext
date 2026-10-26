import { API } from '../api';

interface Upload {
    file: { name: string; size: number; type: string };
}

export default async function run(): Promise<Upload> {
    const form = new FormData();
    form.append('file', new Blob(['Hello, jext!'], { type: 'text/plain' }), 'hello.txt');
    const response = await fetch(`${API}/files`, { method: 'POST', body: form });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as Upload;
}
