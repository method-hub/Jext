import { API } from '../api';

export default function run(): Promise<string> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const controller = new AbortController();
    // The user leaves the page: the server answers in 100 ms, the request is cancelled after 20
    setTimeout(() => controller.abort(), 20);

    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/counter?key=${key}`);
        // XMLHttpRequest takes no signal: the signal calls xhr.abort()
        controller.signal.addEventListener('abort', () => xhr.abort());
        xhr.onabort = () => resolve('cancelled');
        xhr.onload = () => resolve('finished');
        xhr.onerror = () => resolve('failed');
        xhr.send();
    });
}
