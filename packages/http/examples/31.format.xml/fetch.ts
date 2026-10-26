import { API } from '../api';

export default async function run(): Promise<string[]> {
    const response = await fetch(`${API}/books.xml`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const page = new DOMParser().parseFromString(await response.text(), 'application/xml');

    return [...page.querySelectorAll('book > title')].map((title) => title.textContent ?? '');
}
