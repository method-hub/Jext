import * as v from 'valibot';
import { API } from '../api';

const User = v.object({
    id: v.number(),
    name: v.string(),
    email: v.pipe(v.string(), v.email()),
    role: v.picklist(['admin', 'editor', 'viewer']),
});

function getJson(url: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}

export default async function run(): Promise<v.InferOutput<typeof User>> {
    return v.parse(User, await getJson(`${API}/users/1`));
}
