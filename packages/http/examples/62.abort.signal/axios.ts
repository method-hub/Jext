import axios from 'axios';
import { API } from '../api';

export default async function run(): Promise<string> {
    // A new key makes the server count the attempts of this run from one
    const key = Math.random().toString(36).slice(2);
    const controller = new AbortController();
    // The user leaves the page: the server answers in 100 ms, the request is cancelled after 20
    setTimeout(() => controller.abort(), 20);

    try {
        await axios.get(`${API}/counter`, { params: { key }, signal: controller.signal });

        return 'finished';
    } catch (error) {
        // axios turns the abort into a CanceledError
        return axios.isCancel(error) ? 'cancelled' : 'failed';
    }
}
