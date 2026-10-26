import { API } from '../api';

interface Problem {
    status: number;
    message: string;
}

export default function run(): Promise<Problem> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/users/42`);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                reject(new Error('User 42 should not exist'));
            } else {
                const body = xhr.response as { message: string };
                resolve({ status: xhr.status, message: body.message });
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
