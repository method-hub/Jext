import axios from 'axios';
import { API } from '../api';

interface Upload {
    received: number;
    reported: boolean;
}

export default async function run(): Promise<Upload> {
    try {
        // The percent of each progress event, for a progress bar
        const percents: number[] = [];

        // In a browser axios sends through XMLHttpRequest, so it can report the upload
        const { data } = await axios.post<{ received: number }>(`${API}/upload`, new Uint8Array(64 * 1024), {
            headers: { 'Content-Type': 'application/octet-stream' },
            onUploadProgress: (event) => {
                percents.push(Math.floor((event.progress ?? 0) * 100));
            },
        });

        return { received: data.received, reported: percents.length > 0 };
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
