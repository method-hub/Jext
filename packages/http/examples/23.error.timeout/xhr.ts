import { API } from '../api';

export default function run(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/slow`);
        xhr.timeout = 200;
        xhr.onload = () => resolve(false);
        xhr.ontimeout = () => resolve(true);
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
