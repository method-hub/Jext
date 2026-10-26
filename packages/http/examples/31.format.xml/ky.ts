import ky, { HTTPError } from 'ky';
import { API } from '../api';

export default async function run(): Promise<string[]> {
    try {
        const xml = await ky.get(`${API}/books.xml`).text();
        const page = new DOMParser().parseFromString(xml, 'application/xml');

        return [...page.querySelectorAll('book > title')].map((title) => title.textContent ?? '');
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
