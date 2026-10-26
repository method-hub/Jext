import { API } from '../api';

export default function run(): Promise<number> {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/drop`);
        xhr.onload = () => resolve(xhr.status);
        xhr.onerror = () => resolve(0);
        xhr.send();
    });
}
