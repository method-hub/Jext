import { API } from '../api';

export default function run(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}/books.xml`);
        xhr.responseType = 'document';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const page = xhr.response as Document;
                resolve([...page.querySelectorAll('book > title')].map((title) => title.textContent ?? ''));
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}
