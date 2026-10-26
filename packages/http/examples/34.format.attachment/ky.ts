import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface FileInfo {
    type: string;
    size: number;
}

export default async function run(): Promise<FileInfo> {
    try {
        const file = await ky.get(`${API}/export`).blob();

        return { type: file.type, size: file.size };
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
