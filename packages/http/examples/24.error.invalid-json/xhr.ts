import { API } from '../api';

export default function run(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/broken.json`);
        xhr.responseType = 'json';
        xhr.onload = () => resolve(xhr.response === null);
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
