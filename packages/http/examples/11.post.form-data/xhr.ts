import { API } from '../api';

interface Feedback {
    name: string;
    message: string;
}

export default function run(): Promise<Feedback> {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('name', 'Eve Laurent');
        form.append('message', 'The lessons helped a lot!');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API}/feedback`);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response as Feedback);
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(form);
    });
}
