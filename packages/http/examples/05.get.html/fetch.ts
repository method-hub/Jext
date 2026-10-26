import { API } from '../api';

export default async function run(): Promise<string> {
    const response = await fetch(`${API}/about.html`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const page = new DOMParser().parseFromString(await response.text(), 'text/html');

    return page.querySelector('h1')?.textContent ?? '';
}
