import { API } from '../api';

interface Login {
    token: string;
}

export default function run(): Promise<Login> {
    return new Promise((resolve, reject) => {
        const credentials = new URLSearchParams({ username: 'alice', password: 'wonderland' });
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API}/login`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response as Login);
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(credentials.toString());
    });
}
