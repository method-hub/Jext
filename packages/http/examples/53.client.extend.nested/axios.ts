import axios from 'axios';
import { API } from '../api';

interface Seen {
    app: string | null;
    authorization: string | null;
}

const api = axios.create({ baseURL: API, headers: { 'X-App': 'lessons' } });

// create() of an instance merges the new settings into its own
const admin = api.create({ headers: { Authorization: 'Bearer secret-token' } });

export default async function run(): Promise<Seen> {
    try {
        const { data } = await admin.get<Seen>('/echo/headers');

        return data;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
