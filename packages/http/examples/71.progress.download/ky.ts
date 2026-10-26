import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface Download {
    size: number;
    percent: number;
}

export default async function run(): Promise<Download> {
    try {
        let percent = 0;

        // percent of ky is a share from 0 to 1
        const data = await ky
            .get(`${API}/download`, {
                onDownloadProgress: (progress) => {
                    percent = Math.floor(progress.percent * 100);
                },
            })
            .arrayBuffer();

        return { size: data.byteLength, percent };
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
