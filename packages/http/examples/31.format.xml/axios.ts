import axios from 'axios';
import { API } from '../api';

export default async function run(): Promise<string[]> {
    try {
        const { data: xml } = await axios.get<string>(`${API}/books.xml`, { responseType: 'text' });
        const page = new DOMParser().parseFromString(xml, 'application/xml');

        return [...page.querySelectorAll('book > title')].map((title) => title.textContent ?? '');
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
