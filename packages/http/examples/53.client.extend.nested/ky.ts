import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface Seen {
    app: string | null;
    authorization: string | null;
}

const api = ky.create({ baseUrl: API, headers: { 'X-App': 'lessons' } });
const admin = api.extend({ headers: { Authorization: 'Bearer secret-token' } });

export default async function run(): Promise<Seen> {
    try {
        return await admin.get('/echo/headers').json<Seen>();
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
