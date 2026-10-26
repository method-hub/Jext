import axios, { type AxiosResponse } from 'axios';
import { API } from '../api';

interface Outcome {
    attempt: number;
    seconds: number;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAfterBusy<T>(url: string): Promise<AxiosResponse<T>> {
    try {
        return await axios.get<T>(url);
    } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 429) {
            throw error;
        }

        // Retry-After holds seconds or an HTTP date; this server sends seconds
        await sleep(Number(error.response.headers['retry-after'] ?? 1) * 1000);

        return axios.get<T>(url);
    }
}

export default async function run(): Promise<Outcome> {
    try {
        // A new key makes the server count the attempts of this run from one
        const key = Math.random().toString(36).slice(2);
        const started = Date.now();

        const { data } = await getAfterBusy<{ attempt: number }>(`${API}/busy?key=${key}`);

        return { attempt: data.attempt, seconds: Math.round((Date.now() - started) / 1000) };
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
