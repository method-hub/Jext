import { API } from '../api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function run(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        const query = new URLSearchParams({ role: 'admin', limit: String(10) });
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/users?${query.toString()}`);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response as User[]);
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
