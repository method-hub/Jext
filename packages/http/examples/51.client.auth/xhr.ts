import { API } from '../api';

interface User {
    id: number;
    name: string;
}
interface Seen {
    authorization: string | null;
}

function api<T>(path: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API}${path}`);
        xhr.setRequestHeader('Authorization', 'Bearer secret-token');
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response as T);
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}

export default async function run(): Promise<string[]> {
    const [me, seen] = await Promise.all([api<User>('/me'), api<Seen>('/echo/headers')]);

    return [me.name, seen.authorization ?? ''];
}
