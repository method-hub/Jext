import { API } from '../api';

interface Activity {
    type: string;
    user: number;
}

export default function run(): Promise<Activity[]> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/events.ndjson`);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const text = xhr.responseText;
                resolve(
                    text
                        .split('\n')
                        .filter((line) => line.trim() !== '')
                        .map((line) => JSON.parse(line) as Activity)
                );
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
