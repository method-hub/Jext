import ky, { HTTPError } from 'ky';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    try {
        await ky.delete(`${API}/users/4`);

        return true;
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
