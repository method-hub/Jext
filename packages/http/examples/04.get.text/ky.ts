import ky, { HTTPError } from 'ky';
import { API } from '../api';

export default async function run(): Promise<string> {
    try {
        return await ky.get(`${API}/robots.txt`).text();
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
