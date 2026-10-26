import axios, { type AxiosResponse } from 'axios';
import { API } from '../api';

// The statuses worth repeating: the server is busy or briefly down
const RETRYABLE = [408, 429, 500, 502, 503, 504];

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// axios has no retries of its own; the axios-retry package adds them, here they are written by hand
async function getWithRetry<T>(url: string, retries: number, delay: number): Promise<AxiosResponse<T>> {
    try {
        return await axios.get<T>(url);
    } catch (error) {
        const status = axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0;

        if (retries === 0 || !RETRYABLE.includes(status)) {
            throw error;
        }

        await sleep(delay);

        return getWithRetry<T>(url, retries - 1, delay * 2);
    }
}

export default async function run(): Promise<number> {
    try {
        // A new key makes the server count the attempts of this run from one
        const key = Math.random().toString(36).slice(2);

        const { data } = await getWithRetry<{ attempt: number }>(`${API}/flaky?key=${key}`, 2, 100);

        return data.attempt;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
