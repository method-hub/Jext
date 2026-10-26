import { API } from '../api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function run(): Promise<User> {
    return new Promise((resolve, reject) => {
        const user = { role: 'admin' };
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', `${API}/users/2`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response as User);
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(JSON.stringify(user));
    });
}
