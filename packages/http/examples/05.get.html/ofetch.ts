import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

export default async function run(): Promise<string> {
    try {
        const html = await ofetch(`${API}/about.html`, { responseType: 'text' });
        const page = new DOMParser().parseFromString(html, 'text/html');

        return page.querySelector('h1')?.textContent ?? '';
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
