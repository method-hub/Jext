import axios from 'axios';
import { API } from '../api';

interface Download {
    size: number;
    percent: number;
}

export default async function run(): Promise<Download> {
    try {
        let percent = 0;

        const { data } = await axios.get<ArrayBuffer>(`${API}/download`, {
            responseType: 'arraybuffer',
            onDownloadProgress: (event) => {
                percent = Math.floor((event.progress ?? 0) * 100);
            },
        });

        return { size: data.byteLength, percent };
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
