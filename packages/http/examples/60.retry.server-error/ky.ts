import ky, { HTTPError } from 'ky';
import { API } from '../api';

export default async function run(): Promise<number> {
    try {
        // A new key makes the server count the attempts of this run from one
        const key = Math.random().toString(36).slice(2);

        const { attempt } = await ky
            .get(`${API}/flaky`, { searchParams: { key }, retry: { limit: 2, delay: () => 100 } })
            .json<{ attempt: number }>();

        return attempt;
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
