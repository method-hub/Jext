import axios from 'axios';
import { API } from '../api';

interface Login {
    token: string;
}

export default async function run(): Promise<Login> {
    try {
        const credentials = new URLSearchParams({ username: 'alice', password: 'wonderland' });
        const { data } = await axios.post<Login>(`${API}/login`, credentials);

        return data;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
