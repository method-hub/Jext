import { API } from '../api';

interface Upload {
    file: { name: string; size: number; type: string };
}

export default function run(): Promise<Upload> {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('file', new Blob(['Hello, jext!'], { type: 'text/plain' }), 'hello.txt');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API}/files`);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response as Upload);
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(form);
    });
}
