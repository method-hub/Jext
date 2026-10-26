import ky, { HTTPError } from 'ky';
import { API } from '../api';

export default async function run(): Promise<string> {
    try {
        const html = await ky.get(`${API}/about.html`).text();
        const page = new DOMParser().parseFromString(html, 'text/html');

        return page.querySelector('h1')?.textContent ?? '';
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
