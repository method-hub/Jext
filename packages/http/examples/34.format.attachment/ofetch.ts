import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface FileInfo {
    type: string;
    size: number;
}

export default async function run(): Promise<FileInfo> {
    try {
        const file = await ofetch(`${API}/export`, { responseType: 'blob' });

        return { type: file.type, size: file.size };
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
