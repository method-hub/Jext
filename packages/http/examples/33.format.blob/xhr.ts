import { API } from '../api';

interface FileInfo {
    type: string;
    size: number;
}

export default function run(): Promise<FileInfo> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/logo.png`);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const file = xhr.response as Blob;
                resolve({ type: file.type, size: file.size });
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
