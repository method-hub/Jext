import { API } from '../api';

interface User {
    id: number;
    name: string;
}

// The token kept from an earlier session; the server no longer accepts it
let token = 'expired-token';

function send(method: string, path: string, body?: URLSearchParams): Promise<XMLHttpRequest> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `${API}${path}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        if (body) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.responseType = 'json';
        xhr.onload = () => resolve(xhr);
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(body?.toString() ?? null);
    });
}

async function api<T>(path: string): Promise<T> {
    let xhr = await send('GET', path);

    if (xhr.status === 401) {
        const login = await send('POST', '/login', new URLSearchParams({ username: 'alice', password: 'wonderland' }));
        ({ token } = login.response as { token: string });
        xhr = await send('GET', path);
    }

    if (xhr.status < 200 || xhr.status >= 300) {
        throw new Error(`${xhr.status} ${xhr.statusText}`);
    }

    return xhr.response as T;
}

export default async function run(): Promise<string> {
    token = 'expired-token';
    const me = await api<User>('/me');

    return me.name;
}
