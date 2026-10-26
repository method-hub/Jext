import { API } from '../api';

interface Seen {
    app: string | null;
    authorization: string | null;
}

function client(headers: Record<string, string>) {
    return <T>(path: string): Promise<T> =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${API}${path}`);
            Object.entries(headers).forEach(([name, value]) => xhr.setRequestHeader(name, value));
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

const base = { 'X-App': 'lessons' };
const admin = client({ ...base, Authorization: 'Bearer secret-token' });

export default async function run(): Promise<Seen> {
    return admin<Seen>('/echo/headers');
}
