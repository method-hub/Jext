import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

export default async function run(): Promise<string[]> {
    try {
        const xml = await ofetch(`${API}/books.xml`, { responseType: 'text' });
        const page = new DOMParser().parseFromString(xml, 'application/xml');

        return [...page.querySelectorAll('book > title')].map((title) => title.textContent ?? '');
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
