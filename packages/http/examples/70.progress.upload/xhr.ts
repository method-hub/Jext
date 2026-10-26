import { API } from '../api';

interface Upload {
    received: number;
    reported: boolean;
}

export default function run(): Promise<Upload> {
    // The percent of each progress event, for a progress bar
    const percents: number[] = [];

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API}/upload`);
        xhr.responseType = 'json';
        xhr.upload.onprogress = (event) => {
            percents.push(event.lengthComputable ? Math.floor((event.loaded / event.total) * 100) : 0);
        };
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
                return;
            }

            resolve({ received: (xhr.response as { received: number }).received, reported: percents.length > 0 });
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(new Uint8Array(64 * 1024));
    });
}
