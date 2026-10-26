import axios from 'axios';
import { API } from '../api';

export default async function run(): Promise<string> {
    try {
        const { data } = await axios.get<string>(`${API}/robots.txt`, { responseType: 'text' });

        return data;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
