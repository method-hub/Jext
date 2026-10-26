import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Download {
    size: number;
    percent: number;
}

// Reads the body chunk by chunk and counts the bytes against Content-Length
async function count(
    body: ReadableStream<Uint8Array>,
    total: number,
    onPercent: (percent: number) => void
): Promise<number> {
    const reader = body.getReader();
    let loaded = 0;

    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
        loaded += chunk.value.byteLength;
        onPercent(Math.floor((loaded / total) * 100));
    }

    return loaded;
}

export default async function run(): Promise<Download> {
    try {
        let percent = 0;
        // ofetch has no progress option: the raw response gives the stream and its Content-Length
        const response = await ofetch.raw(`${API}/download`, { responseType: 'stream' });
        const total = Number(response.headers.get('Content-Length'));

        const size = await count(response._data, total, (value) => {
            percent = value;
        });

        return { size, percent };
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
