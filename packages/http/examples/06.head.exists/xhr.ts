import { API } from '../api';

function exists(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', `${API}/users/${id}`);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(true);
            } else if (xhr.status === 404) {
                resolve(false);
            } else {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send();
    });
}

export default async function run(): Promise<boolean[]> {
    return [await exists(1), await exists(99)];
}
