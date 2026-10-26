import { API } from '../api';

interface Download {
    size: number;
    percent: number;
}

export default function run(): Promise<Download> {
    let percent = 0;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/download`);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = (event) => {
            percent = event.lengthComputable ? Math.floor((event.loaded / event.total) * 100) : 0;
        };
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
                return;
            }

            resolve({ size: (xhr.response as ArrayBuffer).byteLength, percent });
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
