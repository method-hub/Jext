import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Upload {
    received: number;
    reported: boolean;
}

export default async function run(): Promise<Upload> {
    // The percent of each progress event, for a progress bar
    const percents: number[] = [];

    // With an upload listener jext sends the request through XMLHttpRequest
    const { data, error } = await http
        .post<{ received: number }>(`${API}/upload`)
        .body(new Uint8Array(64 * 1024))
        .onUploadProgress((progress) => {
            percents.push(progress.percent ?? 0);
        });

    if (error) {
        throw error;
    }

    return { received: data.received, reported: percents.length > 0 };
}
