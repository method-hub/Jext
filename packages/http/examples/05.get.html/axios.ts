import axios from 'axios';
import { API } from '../api';

export default async function run(): Promise<string> {
    try {
        const { data: html } = await axios.get<string>(`${API}/about.html`, { responseType: 'text' });
        const page = new DOMParser().parseFromString(html, 'text/html');

        return page.querySelector('h1')?.textContent ?? '';
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
