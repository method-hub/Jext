import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Seen {
    app: string | null;
    authorization: string | null;
}

const headers = { 'X-App': 'lessons' };
const api = ofetch.create({ baseURL: API, headers });

// create() replaces the headers of the first client instead of merging them, so they are spread by hand
const admin = api.create({ headers: { ...headers, Authorization: 'Bearer secret-token' } });

export default async function run(): Promise<Seen> {
    try {
        return await admin<Seen>('/echo/headers');
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
