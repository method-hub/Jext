import axios from 'axios';
import { API } from '../api';

interface FileInfo {
    type: string;
    size: number;
}

export default async function run(): Promise<FileInfo> {
    try {
        const { data: file } = await axios.get<Blob>(`${API}/logo.png`, { responseType: 'blob' });

        return { type: file.type, size: file.size };
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
