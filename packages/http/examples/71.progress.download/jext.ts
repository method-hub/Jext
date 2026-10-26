import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Download {
    size: number;
    percent: number;
}

export default async function run(): Promise<Download> {
    let percent = 0;

    const { data, error } = await http
        .get(`${API}/download`)
        .as('arrayBuffer')
        .onDownloadProgress((progress) => {
            percent = progress.percent ?? 0;
        });

    if (error) {
        throw error;
    }

    return { size: data.byteLength, percent };
}
